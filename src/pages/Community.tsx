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
import { apiService, CommunityPost, CreatePostRequest, compressImage } from "@/lib/api";
import { toast } from "@/hooks/use-toast";

const categoryOptions = [
  { key: "community.category.problem" },
  { key: "community.category.tips" },
  { key: "community.category.experience" },
  { key: "community.category.market" },
];

const Community = () => {
  const { t, language } = useLanguage();
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
  }, [language]); // Reload posts when language changes

  const loadPosts = async () => {
    try {
      setLoading(true);
      const fetchedPosts = await apiService.getCommunityPosts(language);
      const fetchedPosts = await apiService.getCommunityPosts();
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

  // Filter posts based on selected category
  const filteredPosts = selectedCategory 
    ? posts.filter(post => post.category === selectedCategory)
    : posts;

  const handleLike = async (postId: string) => {
    try {
      const result = await apiService.likePost(postId);
      if (result.success) {
        setPosts(posts.map(post => 
          post.id === postId 
            ? { ...post, likes: result.likes }
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
        content: newPost.content,
        category: newPost.category,
        image: newPost.image || undefined,
        language: language
        image: newPost.image || undefined
      };

      const response = await apiService.createPost(postData);
      
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
    <div className="min-h-screen bg-gradient-earth">
      <Header title={t('community.title')} />
      
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
            {t('common.refresh')}
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
                        {t('community.posting')}
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
            className="whitespace-nowrap cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
            onClick={() => setSelectedCategory(null)}
          >
            {t('community.allCategories')} ({posts.length})
          </Badge>
          {categoryOptions.map(opt => {
            const categoryCount = posts.filter(post => post.category === opt.key).length;
            return (
              <Badge 
                key={opt.key} 
                variant={selectedCategory === opt.key ? "default" : "outline"} 
                className="whitespace-nowrap cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                onClick={() => setSelectedCategory(opt.key)}
              >
                {t(opt.key)} ({categoryCount})
              </Badge>
            );
          })}
        </div>

        {/* Posts */}
        <div className="space-y-4">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2 text-muted-foreground">{t('community.loadingPosts')}</span>
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                {selectedCategory 
                  ? `${t(selectedCategory)} ${t('community.categoryNoPosts')}`
                  : t('community.noPosts')
                }
              </p>
            </div>
          ) : (
            filteredPosts.map(post => (
            <Card key={post.id} className="p-4 border-border/50">
              <div className="flex items-start gap-3">
                <Avatar>
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {post.author.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-medium text-foreground">{post.author}</span>
                    <Badge variant="outline" className="text-xs">{t(post.category)}</Badge>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-2">
                    {post.timestamp.toLocaleDateString('hi-IN')} • {post.timestamp.toLocaleTimeString('hi-IN', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                  
                  <p className="text-foreground mb-3">{post.content}</p>
                  
                  {/* Show image if present */}
                  {post.image && (
                    <div className="mb-3">
                      <img src={post.image} alt="Post" className="w-full max-h-48 object-contain rounded-lg" />
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
                      {post.likes}
                    </Button>
                    
                    <Button variant="ghost" size="sm" className="text-muted-foreground">
                      <MessageCircle className="h-4 w-4 mr-1" />
                      {post.comments}
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