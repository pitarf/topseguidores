"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useCheckout } from "@/hooks/useCheckout";
import { X, CheckCircle2, Copy, ShieldCheck, Search, ArrowLeft, ArrowRight, Heart, Play, Loader2, Star, RotateCcw, Check, Clock, Users, Zap } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { 
  searchInstagramProfile, 
  getInstagramFeed, 
  searchTikTokProfile, 
  getTikTokFeed 
} from "@/app/actions/scrapers";

export function CheckoutModal() {
  const { isOpen, closeCheckout, platform, service, setService, selectedPlan, setSelectedPlan } = useCheckout();
  
  // Estado
  const [step, setStep] = useState(2);
  const [packageType, setPackageType] = useState<'brasileiros' | 'mundiais'>('brasileiros');
  const [username, setUsername] = useState("");
  const [profileData, setProfileData] = useState<any>(null);
  const [searching, setSearching] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pixCode, setPixCode] = useState("");
  const [pixQrCodeBase64, setPixQrCodeBase64] = useState("");

  const [timeLeft, setTimeLeft] = useState(600);
  const [posts, setPosts] = useState<any[]>([]);
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentPackages, setCurrentPackages] = useState<any[]>([]);
  const [loadingPlans, setLoadingPlans] = useState(false);

  // Efeitos
  useEffect(() => {
    if (!isOpen) {
      setStep(2);
      setUsername("");
      setProfileData(null);
      setSearching(false);
      setTimeLeft(600);
      setSelectedPost(null);
      setPosts([]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (step === 6 && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [step, timeLeft]);

  // Busca planos dinamicamente quando chega no step 5 ou muda filtros
  useEffect(() => {
    if (step === 5 && service) {
      const fetchPlans = async () => {
        setLoadingPlans(true);
        try {
          const res = await fetch(`/api/plans?platform=${platform}&type=${service}&packageType=${packageType}`);
          const data = await res.json();
          setCurrentPackages(data);
        } catch (error) {
          console.error("Erro ao buscar planos:", error);
          toast.error("Erro ao carregar pacotes");
        } finally {
          setLoadingPlans(false);
        }
      };
      fetchPlans();
    }
  }, [step, platform, service, packageType]);

  // Handlers
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const prevStep = () => {
    if (step === 2) closeCheckout();
    else if (step === 5 && service === 'seguidores') setStep(3);
    else setStep(prev => prev - 1);
  };

  const handleSelectService = (s: "seguidores" | "curtidas" | "visualizacoes") => {
    setService(s);
    setStep(3);
  };

  const handleSearchProfile = async () => {
    if (!username.trim()) return toast.error("Insira seu @usuário");
    setSearching(true);
    
    try {
      if (platform === 'instagram') {
        const resultP = await searchInstagramProfile(username);
        if (!resultP.success) throw new Error(resultP.error);
        
        const dataP = resultP.data;
        const user = dataP.data?.user || dataP.user;

        if (user) {
          setProfileData({
            success: true,
            profile_pic_url: user.profile_pic_url,
            full_name: user.full_name,
            username: user.username,
            followers: user.follower_count?.toLocaleString('pt-BR') || "---",
            userId: user.id
          });

          const mType = service === 'visualizacoes' ? 'reels' : 'posts';
          const resultM = await getInstagramFeed(username, mType as any);
          if (!resultM.success) throw new Error(resultM.error);

          const dataM = resultM.data;
          const list = dataM.data?.posts || dataM.data?.items || dataM.items || [];

          if (list.length > 0) {
            const mapped = list.map((m: any, idx: number) => ({
              id: m.pk || m.id || `m-${idx}`,
              url: m.image_versions2?.candidates?.[0]?.url || m.image_urls?.[0] || m.image?.[0]?.url || m.thumbnail_url, 
              likes: (m.play_count || m.view_count || m.like_count || 0).toLocaleString('pt-BR'),
              type: (m.product_type === "clips" || mType === 'reels') ? 'reels' : 'image',
              code: m.code
            }));
            setPosts(mapped);
            setNextCursor(dataM.data?.next_cursor || dataM.next_cursor || null);
          }
        } else {
          toast.error("Perfil não encontrado");
        }
      } else {
        // TikTok
        const resultP = await searchTikTokProfile(username);
        if (!resultP.success) throw new Error(resultP.error);

        const dataP = resultP.data;
        const user = dataP.data?.user;

        if (user) {
          setProfileData({
            success: true,
            profile_pic_url: user.avatar_larger?.url_list?.[0] || user.avatar_medium?.url_list?.[0] || user.avatar_thumb?.url_list?.[0],
            full_name: user.nickname,
            username: user.unique_id,
            followers: user.follower_count?.toLocaleString('pt-BR') || "---",
            userId: user.uid || user.id
          });

          const resultM = await getTikTokFeed(username);
          if (!resultM.success) throw new Error(resultM.error);

          const dataM = resultM.data;
          const list = dataM.data?.aweme_list || [];

          if (list.length > 0) {
            const mapped = list.map((m: any, idx: number) => ({
              id: m.aweme_id || `tk-${idx}`,
              url: m.video?.cover?.url_list?.[0] || m.video?.dynamic_cover?.url_list?.[0],
              likes: (service === 'visualizacoes' ? m.statistics?.play_count : m.statistics?.digg_count || 0).toLocaleString('pt-BR'),
              type: 'reels',
              code: m.aweme_id
            }));
            setPosts(mapped);
            setNextCursor(dataM.data?.max_cursor || null);
          }
        } else {
          toast.error("Perfil não encontrado no TikTok");
        }
      }
    } catch (e: any) {
      toast.error(e.message || "Erro na busca do perfil");
    } finally {
      setSearching(false);
    }
  };

  const handleLoadMore = async () => {
    if (!nextCursor || loadingMore) return;
    setLoadingMore(true);
    
    try {
      if (platform === 'instagram') {
        const mType = service === 'visualizacoes' ? 'reels' : 'posts';
        const resultM = await getInstagramFeed(username, mType as any, nextCursor);
        if (!resultM.success) throw new Error(resultM.error);

        const dataM = resultM.data;
        const list = dataM.data?.posts || dataM.data?.items || dataM.items || [];

        if (list.length > 0) {
          const mapped = list.map((m: any, idx: number) => ({
            id: m.pk || m.id || `m-more-${idx}-${Date.now()}`,
            url: m.image_versions2?.candidates?.[0]?.url || m.image_urls?.[0] || m.image?.[0]?.url || m.thumbnail_url,
            likes: (m.play_count || m.view_count || m.like_count || 0).toLocaleString('pt-BR'),
            type: (m.product_type === "clips" || mType === 'reels') ? 'reels' : 'image',
            code: m.code
          }));
          setPosts(prev => [...prev, ...mapped]);
          setNextCursor(dataM.data?.next_cursor || dataM.next_cursor || null);
        } else {
          setNextCursor(null);
        }
      } else {
        // TikTok
        const resultM = await getTikTokFeed(username, nextCursor);
        if (!resultM.success) throw new Error(resultM.error);

        const dataM = resultM.data;
        const list = dataM.data?.aweme_list || [];

        if (list.length > 0) {
          const mapped = list.map((m: any, idx: number) => ({
            id: m.aweme_id || m.id || `tk-more-${idx}-${Date.now()}`,
            url: m.video?.cover?.url_list?.[0] || m.video?.dynamic_cover?.url_list?.[0],
            likes: (service === 'visualizacoes' ? m.statistics?.play_count : m.statistics?.digg_count || 0).toLocaleString('pt-BR'),
            type: 'reels',
            code: m.aweme_id || m.id
          }));
          setPosts(prev => [...prev, ...mapped]);
          setNextCursor(dataM.data?.max_cursor || null);
        } else {
          setNextCursor(null);
        }
      }
    } catch (e: any) {
      toast.error(e.message || "Erro ao carregar mais");
    } finally {
      setLoadingMore(false);
    }
  };

  const handleGeneratePix = async () => {

    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planId: selectedPlan?.id,
          instagramUrl: `https://instagram.com/${username.replace("@", "")}`,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setPixCode(data.pixCode);
      setPixQrCodeBase64(data.pixQrCodeBase64);
      setStep(7);
    } catch (e) {
      toast.error("Erro no PIX");
    } finally {
      setLoading(false);
    }
  };

  // Renderização condicional para o Modal
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] bg-[#0b111e] flex flex-col items-center p-6 md:p-12 overflow-y-auto"
      >
        <div className="w-full max-w-4xl mx-auto flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between mb-8 md:mb-12">
            <button onClick={prevStep} className="flex items-center gap-1.5 text-zinc-500 hover:text-white transition-colors text-[10px] md:text-sm font-bold uppercase tracking-widest">
              <ArrowLeft className="w-3 h-3 md:w-4 md:h-4" /> Voltar
            </button>
            <button onClick={closeCheckout} className="p-2 text-zinc-500 hover:text-white transition-colors">
              <X className="w-6 h-6 md:w-8 md:h-8" />
            </button>
          </div>

          {/* Stepper */}
          <div className="flex items-center justify-center gap-1.5 md:gap-4 mb-10 md:mb-16">
            {[2, 3, 4, 5, 6, 7].map((num) => (
              <div key={num} className="flex items-center gap-1.5 md:gap-4">
                <div className={`w-7 h-7 md:w-10 md:h-10 rounded-full flex items-center justify-center font-bold text-[10px] md:text-sm transition-all ${
                  step === num ? "bg-primary text-white shadow-[0_0_20px_#3b82f6]" : 
                  step > num ? "bg-primary/40 text-white" : "bg-zinc-800/50 text-zinc-600"
                }`}>{num - 1}</div>
                {num < 7 && <div className={`w-4 md:w-12 h-0.5 rounded-full ${step > num ? "bg-primary/40" : "bg-zinc-800/50"}`} />}
              </div>
            ))}
          </div>

          {/* Conteúdo dinâmico baseado no step */}
          <div className="flex-1 flex flex-col items-center">
            {step === 2 && (
              <div className="w-full space-y-12">
                <div className="text-center">
                  <h1 className="text-3xl md:text-6xl font-black text-white mb-3 md:mb-4 tracking-tight">Escolha o serviço</h1>
                  <p className="text-zinc-500 text-sm md:text-base">Selecione o que deseja impulsionar no {platform === 'instagram' ? 'Instagram' : 'TikTok'}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                  {[
                    { id: 'seguidores', label: 'Seguidores', icon: Heart },
                    { id: 'curtidas', label: 'Curtidas', icon: Heart },
                    { id: 'visualizacoes', label: 'Visualizações', icon: Play },
                  ].map((s) => (
                    <button key={s.id} onClick={() => handleSelectService(s.id as any)} className="group p-6 md:p-10 rounded-[1.5rem] md:rounded-[2rem] border border-white/5 bg-[#121826]/40 hover:border-primary transition-all flex flex-col items-center">
                      <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-[#0b111e] flex items-center justify-center text-primary mb-4 md:mb-6 group-hover:scale-110 transition-transform">
                        <s.icon className="w-6 h-6 md:w-8 md:h-8" />
                      </div>
                      <span className="text-lg md:text-xl font-black text-white">{s.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="w-full max-w-xl mx-auto space-y-10">
                <div className="text-center">
                  <h1 className="text-3xl md:text-6xl font-black text-white mb-2 md:mb-4 tracking-tight">Buscar perfil</h1>
                  <p className="text-zinc-500 text-sm md:text-base">Digite o @usuário abaixo</p>
                </div>
                <div className="bg-[#121826]/60 border border-white/5 rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-10 space-y-6">
                  <div className="flex gap-2 md:gap-3">
                    <input type="text" placeholder="neymarjr" value={username} onChange={(e) => setUsername(e.target.value)} className="flex-1 bg-[#0b111e] border border-white/10 rounded-2xl py-4 md:py-5 px-5 md:px-6 text-white outline-none font-bold text-base md:text-lg focus:border-primary/50 transition-all" />
                    <button onClick={handleSearchProfile} disabled={searching} className="w-14 h-14 md:w-16 md:h-16 bg-primary rounded-2xl flex items-center justify-center text-white shadow-lg active:scale-95 transition-all">
                      {searching ? <Loader2 className="animate-spin w-5 h-5 md:w-6 md:h-6" /> : <Search className="w-5 h-5 md:w-6 md:h-6" />}
                    </button>
                  </div>
                  {profileData && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-5 rounded-2xl border border-primary/30 bg-primary/5 flex items-center gap-4">
                      <img src={`https://images.weserv.nl/?url=${encodeURIComponent(profileData.profile_pic_url)}`} className="w-16 h-16 rounded-full border-2 border-primary/50 object-cover" alt="Avatar" />
                      <div className="flex-1 min-w-0 text-left">
                        <h3 className="text-white font-black text-lg truncate">@{profileData.username}</h3>
                        <p className="text-zinc-600 font-bold text-xs uppercase tracking-widest">{profileData.followers} seguidores</p>
                      </div>
                      <CheckCircle2 className="text-green-500 w-6 h-6" />
                    </motion.div>
                  )}
                  {profileData && (
                    <button onClick={() => setStep(service === 'seguidores' ? 5 : 4)} className="w-full py-6 bg-primary text-white font-black rounded-2xl shadow-xl flex items-center justify-center gap-2 group hover:scale-[1.02] active:scale-95 transition-all">
                      Confirmar perfil <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  )}
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="w-full max-w-xl mx-auto space-y-10">
                <div className="text-center">
                  <h1 className="text-2xl md:text-4xl font-black text-white mb-2 md:mb-4 tracking-tight">Selecione a publicação</h1>
                  <p className="text-zinc-500 text-sm md:text-base">Escolha onde deseja receber as {service}</p>
                </div>
                <div className="bg-[#121826]/60 border border-white/5 rounded-[2rem] p-4 md:p-6 space-y-8">
                  <div className="grid grid-cols-3 gap-3">
                    {posts.map((post) => (
                      <button key={post.id} onClick={() => setSelectedPost(post)} className={`relative aspect-square rounded-xl overflow-hidden border-[3px] transition-all group ${selectedPost?.id === post.id ? 'border-primary shadow-[0_0_15px_rgba(59,130,246,0.3)]' : 'border-transparent'}`}>
                        <img src={`https://images.weserv.nl/?url=${encodeURIComponent(post.url)}&w=400&h=400&fit=cover`} className="w-full h-full object-cover group-hover:scale-110 transition-transform" alt="Post" />
                        {selectedPost?.id === post.id && (
                          <div className="absolute inset-0 bg-primary/20 flex items-center justify-center animate-in zoom-in duration-300">
                            <Check className="text-white stroke-[4] w-8 h-8" />
                          </div>
                        )}
                        <div className="absolute bottom-1 left-1 flex items-center gap-1 text-white text-[8px] font-bold bg-black/50 px-1 rounded shadow-sm">
                          {post.type === 'reels' ? <Play className="w-2 h-2 fill-white" /> : <Heart className="w-2 h-2 fill-white" />} {post.likes}
                        </div>
                      </button>
                    ))}
                  </div>

                  {nextCursor && (
                    <button 
                      onClick={handleLoadMore}
                      disabled={loadingMore}
                      className="w-full py-4 text-primary font-black text-sm border-b border-white/5 flex items-center justify-center gap-2 hover:bg-primary/5 transition-all rounded-xl mt-2"
                    >
                      {loadingMore ? <Loader2 className="animate-spin w-4 h-4" /> : "Ver mais publicações"}
                    </button>
                  )}

                  <button onClick={() => setStep(5)} disabled={!selectedPost} className="w-full py-6 bg-primary text-white font-black rounded-2xl shadow-xl flex items-center justify-center gap-2 group hover:scale-[1.02] active:scale-95 disabled:opacity-50 transition-all mt-4">
                    Confirmar seleção <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            )}

            {step === 5 && (
              <div className="w-full space-y-10">
                <div className="text-center">
                  <h1 className="text-3xl md:text-6xl font-black text-white mb-2 md:mb-4 tracking-tight">Qual o pacote?</h1>
                  <p className="text-zinc-500 text-sm md:text-base">Quanto mais você compra, maior o desconto</p>
                </div>

                {/* Seletor de Tipo de Pacote */}
                <div className="flex justify-center mb-8">
                  <div className="bg-[#121826] p-1.5 rounded-2xl border border-white/5 flex gap-1">
                    <button 
                      onClick={() => setPackageType('brasileiros')}
                      className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                        packageType === 'brasileiros' ? "bg-primary text-white shadow-lg" : "text-zinc-500 hover:text-white"
                      }`}
                    >
                      Brasileiros
                    </button>
                    <button 
                      onClick={() => setPackageType('mundiais')}
                      className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                        packageType === 'mundiais' ? "bg-primary text-white shadow-lg" : "text-zinc-500 hover:text-white"
                      }`}
                    >
                      Mundiais
                    </button>
                  </div>
                </div>

                {loadingPlans ? (
                  <div className="flex flex-col items-center py-20">
                    <Loader2 className="w-12 h-12 text-primary animate-spin" />
                    <p className="mt-4 text-zinc-500 animate-pulse font-bold uppercase tracking-widest text-xs">Buscando pacotes atualizados...</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4">
                    {currentPackages.map((pkg: any) => (
                      <button
                        key={pkg.id}
                        onClick={() => { setSelectedPlan(pkg); setStep(6); }}
                        className={`group relative p-3 md:p-6 rounded-2xl md:rounded-3xl border transition-all text-left flex flex-col justify-between h-full ${
                          selectedPlan?.id === pkg.id 
                            ? "bg-primary border-primary shadow-[0_0_30px_rgba(59,130,246,0.4)]" 
                            : "bg-[#121826]/40 border-white/5 hover:border-primary/50"
                        }`}
                      >
                        {pkg.badge && (
                          <div className={`absolute -top-2 left-2 md:left-4 px-2 md:px-3 py-0.5 md:py-1 rounded-full text-[6px] md:text-[8px] font-black uppercase tracking-wider ${
                            selectedPlan?.id === pkg.id ? "bg-white text-primary" : "bg-primary text-white"
                          }`}>
                            {pkg.badge}
                          </div>
                        )}
                        
                        <div>
                          <div className={`text-lg md:text-2xl font-black mb-0.5 md:mb-1 ${selectedPlan?.id === pkg.id ? "text-white" : "text-white"}`}>
                            {pkg.quantity.toLocaleString('pt-BR')}
                          </div>
                          <div className={`text-[8px] md:text-[10px] font-bold uppercase tracking-widest mb-2 md:mb-4 ${selectedPlan?.id === pkg.id ? "text-white/70" : "text-zinc-500"}`}>
                            {service}
                          </div>
                        </div>

                        <div className="mt-2 md:mt-4">
                          {pkg.oldPrice && (
                            <div className={`text-[8px] md:text-[10px] line-through font-bold ${selectedPlan?.id === pkg.id ? "text-white/50" : "text-zinc-600"}`}>
                              R$ {pkg.oldPrice.toFixed(2).replace('.', ',')}
                            </div>
                          )}
                          <div className={`text-base md:text-xl font-black ${selectedPlan?.id === pkg.id ? "text-white" : "text-[#10b981]"}`}>
                            R$ {pkg.price}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
                
                {currentPackages.length === 0 && !loadingPlans && (
                  <div className="text-center py-20 bg-white/5 rounded-[2rem] border border-dashed border-white/10">
                    <p className="text-zinc-500 font-bold">Nenhum pacote encontrado para esta seleção.</p>
                  </div>
                )}
              </div>
            )}

            {step === 6 && (
              <div className="w-full max-w-lg mx-auto space-y-6 pb-12">
                <div className="text-center mb-6 md:mb-8">
                  <h1 className="text-xl md:text-3xl font-black text-white mb-1 md:mb-2 tracking-tight uppercase tracking-widest">Finalizar Pedido</h1>
                  <p className="text-zinc-500 text-xs md:text-sm">Complete seu pedido em poucos passos</p>
                </div>

                <div className="bg-[#121826]/60 border border-white/5 rounded-[2rem] md:rounded-[2.5rem] p-5 md:p-8 space-y-5 md:y-6 shadow-2xl relative overflow-hidden">
                  
                  {/* Timer Box */}
                  <div className="bg-red-500/5 border border-red-500/20 p-4 rounded-2xl text-center space-y-1">
                    <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2">
                      <Clock className="w-3 h-3 text-red-500" /> Sua reserva expira em
                    </p>
                    <p className="text-red-500 font-mono text-3xl font-black">{formatTime(timeLeft)}</p>
                    <p className="text-zinc-500 text-[9px]">Finalize agora para garantir o preço promocional</p>
                  </div>

                  {/* Plan Summary */}
                  <div className="bg-primary/5 border border-primary/20 p-4 rounded-2xl flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
                      <Zap className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-bold text-sm">
                        {selectedPlan?.quantity?.toLocaleString('pt-BR')}x {service === 'visualizacoes' ? 'Visualizações Reels' : service} {packageType === 'mundiais' ? 'mundiais' : 'brasileiros'}
                      </p>
                      <p className="text-primary font-black text-lg">R$ {selectedPlan?.price}</p>
                    </div>
                  </div>

                  {/* Profile Preview */}
                  {profileData && (
                    <div className="bg-white/5 border border-white/5 p-4 rounded-2xl flex items-center gap-4 text-left">
                      <img src={`https://images.weserv.nl/?url=${encodeURIComponent(profileData.profile_pic_url)}`} className="w-14 h-14 rounded-full border-2 border-primary/30 object-cover" alt="Avatar" />
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white font-black text-base truncate">@{profileData.username}</h3>
                        <p className="text-zinc-500 font-bold text-[10px] uppercase tracking-widest">{profileData.followers} seguidores</p>
                      </div>
                    </div>
                  )}



                  {/* Pix Box */}
                  <div className="bg-primary/5 border border-primary/20 p-4 rounded-2xl flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-500">
                      <Zap className="w-5 h-5 fill-current" />
                    </div>
                    <div className="text-left">
                      <p className="text-white font-bold text-sm">Pix</p>
                      <p className="text-zinc-500 text-[10px]">Pagamento rápido e aprovado na hora</p>
                    </div>
                  </div>

                  {/* Social Proof */}
                  <div className="bg-white/5 p-3 rounded-2xl flex items-center justify-center gap-2">
                    <Users className="w-4 h-4 text-primary" />
                    <span className="text-white font-bold text-xs">+245 pedidos realizados <span className="text-emerald-500">●</span></span>
                  </div>

                  {/* Testimonials Mini */}
                  <div className="space-y-3">
                    <p className="text-zinc-500 text-[9px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
                      <Star className="w-3 h-3 text-primary fill-primary" /> O que dizem nossos clientes
                    </p>
                    <div className="space-y-2">
                      {[
                        { name: 'Lucas M.', text: 'Recebi em menos de 1 hora, muito rápido!', initial: 'L' },
                        { name: 'Ana C.', text: 'Já é meu terceiro pedido, sempre entrega certinho.', initial: 'A' },
                        { name: 'Pedro S.', text: 'Excelente atendimento e entrega garantida!', initial: 'P' },
                      ].map((t, i) => (
                        <div key={i} className="bg-white/5 p-3 rounded-xl flex items-start gap-3 text-left">
                          <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-primary font-black text-[10px] shrink-0">{t.initial}</div>
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-1.5">
                              <span className="text-white font-bold text-[10px]">{t.name}</span>
                              <div className="flex gap-0.5"><Star className="w-2 h-2 text-orange-500 fill-orange-500" /><Star className="w-2 h-2 text-orange-500 fill-orange-500" /><Star className="w-2 h-2 text-orange-500 fill-orange-500" /><Star className="w-2 h-2 text-orange-500 fill-orange-500" /><Star className="w-2 h-2 text-orange-500 fill-orange-500" /></div>
                            </div>
                            <p className="text-zinc-500 text-[9px] leading-tight">{t.text}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Trust Badges */}
                  <div className="flex justify-center gap-6 py-2">
                    <div className="flex items-center gap-1.5 text-zinc-500 text-[9px] font-bold">
                      <ShieldCheck className="w-3 h-3 text-primary" /> Compra Segura
                    </div>
                    <div className="flex items-center gap-1.5 text-zinc-500 text-[9px] font-bold">
                      <CheckCircle2 className="w-3 h-3 text-primary" /> Garantia 90 dias
                    </div>
                  </div>

                  {/* Replacement Guarantee */}
                  <div className="bg-emerald-500/5 border border-emerald-500/20 p-4 rounded-2xl text-left flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-500 mt-0.5">
                      <Check className="w-4 h-4 stroke-[3]" />
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-emerald-500 font-black text-xs">Garantia de reposição gratuita</p>
                      <p className="text-zinc-500 text-[9px] leading-snug font-medium">Se não atingir a quantidade contratada, repomos sem custo adicional.</p>
                    </div>
                  </div>

                  {/* Pay Button */}
                  <button 
                    onClick={handleGeneratePix} 
                    disabled={loading} 
                    className="w-full py-4 md:py-5 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-black rounded-2xl shadow-[0_10px_30px_rgba(59,130,246,0.4)] active:scale-95 transition-all flex flex-col items-center justify-center gap-0.5 group"
                  >
                    <div className="flex items-center gap-2">
                      {loading ? <Loader2 className="animate-spin w-5 h-5 md:w-6 md:h-6" /> : (
                        <>
                          <Zap className="w-4 h-4 md:w-5 md:h-5 fill-white" />
                          <span className="text-sm md:text-base uppercase tracking-tight">Pagar agora com Pix</span>
                        </>
                      )}
                    </div>
                    {!loading && <span className="text-[8px] md:text-[9px] opacity-70 font-medium">Aprovação instantânea • Entrega automática</span>}
                  </button>

                  <button onClick={() => setStep(2)} className="w-full py-4 text-zinc-500 hover:text-white font-bold text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2">
                    <RotateCcw className="w-3 h-3" /> Voltar aos serviços
                  </button>

                </div>
              </div>
            )}

            {step === 7 && (
              <div className="w-full max-w-xl space-y-8 text-center animate-in fade-in duration-700">
                <h1 className="text-4xl font-black text-white tracking-tight">QR Code Gerado! 🚀</h1>
                <div className="bg-white p-6 rounded-3xl inline-block mx-auto shadow-[0_0_50px_rgba(255,255,255,0.1)]">
                  {pixQrCodeBase64 && <img src={pixQrCodeBase64} alt="QR Code Pix" className="w-56 h-56" />}
                  <p className="text-black text-[10px] font-black mt-2 uppercase tracking-tighter">Início em até 3 minutos ⚡</p>
                </div>
                <div className="space-y-4">
                  <button onClick={() => { navigator.clipboard.writeText(pixCode); toast.success("Copiado com sucesso!"); }} className="w-full py-6 bg-white text-black font-black rounded-2xl flex items-center justify-center gap-3 hover:bg-zinc-200 transition-all active:scale-95">
                    <Copy className="w-6 h-6" /> COPIAR CÓDIGO PIX
                  </button>
                  <div className="bg-emerald-500/5 border border-emerald-500/20 p-4 rounded-2xl">
                    <p className="text-emerald-500 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2">
                      <Zap className="w-4 h-4 fill-current" /> Entrega ultrarrápida
                    </p>
                    <p className="text-zinc-400 text-[10px] mt-1">O seu pedido começará a chegar em até 3 minutos após a confirmação!</p>
                  </div>
                  <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Liberação instantânea após o pagamento</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
