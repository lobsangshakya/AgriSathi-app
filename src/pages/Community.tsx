import { useRef, useState } from "react";
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
  Camera
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useLanguage } from "@/contexts/LanguageContext";

const categoryOptions = [
  { key: "community.category.problem" },
  { key: "community.category.tips" },
  { key: "community.category.experience" },
  { key: "community.category.market" },
];

const Community = () => {
  const { t } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [posts, setPosts] = useState([
    {
      id: 1,
      author: "राम कुमार",
      location: "पंजाब",
      time: "2 घंटे पहले",
      content: "मेरे गेहूं की फसल में पीले धब्बे दिख रहे हैं। क्या यह कोई बीमारी है? कृपया सुझाव दें।",
      image: "🌾",
      likes: 12,
      comments: 5,
      agriCreds: 25,
      category: "community.category.problem"
    },
    {
      id: 2,
      author: "सुनीता देवी",
      location: "हरियाणा",
      time: "4 घंटे पहले",
      content: "जैविक खाद बनाने का आसान तरीका। गोबर + नीम की पत्ती + गुड़ मिलाकर 15 दिन में तैयार होती है।",
      image: "🌱",
      likes: 28,
      comments: 8,
      agriCreds: 50,
      category: "community.category.tips"
    },
    {
      id: 3,
      author: "अजय सिंह",
      location: "उत्तर प्रदेश", 
      time: "6 घंटे पहले",
      content: "ड्रिप सिंचाई लगाने के बाद 40% पानी की बचत हुई। बहुत फायदेमंद है!",
      image: "💧",
      likes: 35,
      comments: 12,
      agriCreds: 75,
      category: "community.category.experience"
    }
  ]);

  const [newPost, setNewPost] = useState({
    content: "",
    category: "community.category.problem",
    image: null as string | null,
  });

  const handleLike = (postId: number) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, likes: post.likes + 1 }
        : post
    ));
  };

  const handleAddPhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setNewPost((prev) => ({ ...prev, image: ev.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const addPost = () => {
    if (newPost.content.trim()) {
      const post = {
        id: posts.length + 1,
        author: "आप",
        location: "आपका स्थान",
        time: "अभी",
        content: newPost.content,
        image: newPost.image,
        likes: 0,
        comments: 0,
        agriCreds: 10,
        category: newPost.category
      };
      setPosts([post, ...posts]);
      setNewPost({ content: "", category: "community.category.problem", image: null });
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
          <Dialog>
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
                  <Button onClick={addPost} className="flex-1">
                    {t('community.postNow')}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categoryOptions.map(opt => (
            <Badge key={opt.key} variant="outline" className="whitespace-nowrap cursor-pointer hover:bg-primary hover:text-primary-foreground">
              {t(opt.key)}
            </Badge>
          ))}
        </div>

        {/* Posts */}
        <div className="space-y-4">
          {posts.map(post => (
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
                    <div className="flex items-center gap-1 text-success">
                      <Coins className="h-3 w-3" />
                      <span className="text-xs font-medium">+{post.agriCreds}</span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-2">
                    {post.location} • {post.time}
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
          ))}
        </div>
      </div>
    </div>
  );
};

export default Community;