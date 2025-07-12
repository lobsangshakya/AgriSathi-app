import { useRef, useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Plus, 
  Search,
  TrendingUp,
  Coins,
  Camera,
  Loader2,
  RefreshCw
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useLanguage } from "@/contexts/LanguageContext";
import { useUser } from "@/contexts/UserContext";
import { api, CommunityPost, CreatePostRequest, compressImage } from "@/lib/api";
import { toast } from "@/hooks/use-toast";

const categoryOptions = [
  { key: "community.category.problem" },
  { key: "community.category.tips" },
  { key: "community.category.experience" },
  { key: "community.category.market" },
];

const Community = () => {
  const { t } = useLanguage();
  const { user, updateStats } = useUser();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newPost, setNewPost] = useState({
    content: "",
    category: "community.category.problem",
    image: null as string | null,
  });

  // Load posts from API
  useEffect(() => {
    loadPosts();
  }, [selectedCategory]);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const fetchedPosts = await api.community.getPosts();
      setPosts(fetchedPosts);
    } catch (error) {
      console.error('Failed to load posts:', error);
      toast({
        title: t('common.error') || 'Error',
        description: 'Failed to load posts',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId: string) => {
    try {
      const result = await api.community.likePost(postId);
      if (result.success) {
        setPosts(posts.map(post => 
          post.id === postId 
            ? { ...post, likes_count: result.likes }
            : post
        ));
      }
    } catch (error) {
      console.error('Failed to like post:', error);
      toast({
        title: t('common.error') || 'Error',
        description: 'Failed to like post',
        variant: 'destructive',
      });
    }
  };

  const handleAddPhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressedImage = await compressImage(file);
        setNewPost((prev) => ({ ...prev, image: compressedImage }));
      } catch (error) {
        console.error('Failed to process image:', error);
        toast({
          title: t('common.error') || 'Error',
          description: 'Failed to process image',
          variant: 'destructive',
        });
      }
    }
  };

  const addPost = async () => {
    if (!newPost.content.trim()) {
      toast({
        title: 'Error',
        description: 'Please write something to post',
        variant: 'destructive',
      });
      return;
    }

    try {
      setPosting(true);
      
      const postData: CreatePostRequest = {
        title: `Post by ${user?.name || 'User'}`,
        content: newPost.content,
        category: newPost.category,
        image_url: newPost.image || undefined
      };

      const response = await api.community.createPost(postData);
      
      if (response.success) {
        setPosts([response.post, ...posts]);
        setNewPost({ content: "", category: "community.category.problem", image: null });
        setIsDialogOpen(false);
        
        // Add AgriCreds for posting
        if (user) {
          updateStats('post');
        }
        
        toast({
          title: 'Success',
          description: response.message || 'Post created successfully! +10 AgriCreds earned!',
        });
      }
    } catch (error) {
      console.error('Failed to create post:', error);
      toast({
        title: t('common.error') || 'Error',
        description: 'Failed to create post',
        variant: 'destructive',
      });
    } finally {
      setPosting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-app">
      <Header title={t('header.agrisathi')} />
      
      <div className="p-4 space-y-4">
        {/* Search and Filter */}
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input placeholder={t('community.searchPosts')} className="pl-9" />
          </div>
          <Button 
            variant="outline" 
            onClick={loadPosts}
            disabled={loading}
            className="gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            रिफ्रेश
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="h-4 w-4 mr-2" />
                {t('community.post')}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t('community.newPost')}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">{t('community.category')}</label>
                  <select 
                    value={newPost.category}
                    onChange={(e) => setNewPost({...newPost, category: e.target.value})}
                    className="w-full p-2 border border-border rounded-md"
                  >
                    {categoryOptions.map(opt => (
                      <option key={opt.key} value={opt.key}>{t(opt.key)}</option>
                    ))}
                  </select>
                </div>
                <Textarea
                  placeholder={t('community.writeQuestion')}
                  value={newPost.content}
                  onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                  rows={4}
                />
                {/* Image preview if selected */}
                {newPost.image && (
                  <div className="mb-2 flex justify-center">
                    <img src={newPost.image} alt="Preview" className="max-h-32 rounded-lg" />
                  </div>
                )}
                <div className="flex gap-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                  <Button variant="outline" className="flex-1" type="button" onClick={handleAddPhotoClick}>
                    <Camera className="h-4 w-4 mr-2" />
                    {t('community.addPhoto')}
                  </Button>
                  <Button onClick={addPost} className="flex-1" disabled={posting}>
                    {posting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        पोस्ट हो रही है...
                      </>
                    ) : (
                      t('community.postNow')
                    )}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          <Badge 
            variant={selectedCategory === null ? "default" : "outline"} 
            className="whitespace-nowrap cursor-pointer hover:bg-primary hover:text-primary-foreground"
            onClick={() => setSelectedCategory(null)}
          >
            सभी (All)
          </Badge>
          {categoryOptions.map(opt => (
            <Badge 
              key={opt.key} 
              variant={selectedCategory === opt.key ? "default" : "outline"} 
              className="whitespace-nowrap cursor-pointer hover:bg-primary hover:text-primary-foreground"
              onClick={() => setSelectedCategory(opt.key)}
            >
              {t(opt.key)}
            </Badge>
          ))}
        </div>

        {/* Posts */}
        <div className="space-y-4">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2 text-muted-foreground">पोस्ट लोड हो रही हैं...</span>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">कोई पोस्ट नहीं मिली</p>
            </div>
          ) : (
            posts.map(post => (
            <Card key={post.id} className="p-4 border-border/50">
              <div className="flex items-start gap-3">
                <Avatar>
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {post.profiles?.name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-medium text-foreground">{post.profiles?.name || 'User'}</span>
                    <Badge variant="outline" className="text-xs">{t(post.category)}</Badge>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-2">
                    {new Date(post.created_at).toLocaleDateString('hi-IN')} • {new Date(post.created_at).toLocaleTimeString('hi-IN', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                  
                  <p className="text-foreground mb-3">{post.content}</p>
                  
                  {/* Show image if present */}
                  {post.image_url && (
                    <div className="mb-3">
                      <img src={post.image_url} alt="Post" className="w-full max-h-48 object-contain rounded-lg" />
                    </div>
                  )}
                  
                  <div className="flex items-center gap-4">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleLike(post.id)}
                      className="text-muted-foreground hover:text-red-500"
                    >
                      <Heart className="h-4 w-4 mr-1" />
                      {post.likes_count}
                    </Button>
                    
                    <Button variant="ghost" size="sm" className="text-muted-foreground">
                      <MessageCircle className="h-4 w-4 mr-1" />
                      {post.comments_count}
                    </Button>
                    
                    <Button variant="ghost" size="sm" className="text-muted-foreground">
                      <Share2 className="h-4 w-4 mr-1" />
                      {t('community.share')}
                    </Button>
                  </div>
                                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Community;