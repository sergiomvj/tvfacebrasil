import { Skeleton } from "@/components/ui/skeleton";

// Full Width Responsive Banner (Top)
// Recommended for Media Kit: 1280x150px (Desktop) / 360x100px (Mobile)
export function AdBanner({ slot }: { slot: string }) {
    return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-muted/20 border border-border/50 rounded-xl overflow-hidden p-0 text-center group transition-all hover:border-primary/30">
            {/* Full Width Container */}
            <div className="w-full relative overflow-hidden bg-muted/10 group-hover:bg-muted/20 transition-colors">
                {/* Visual Placeholder: Scales with width, maintains Aspect Ratio ~ 8:1 (Desktop) / 4:1 (Mobile) */}
                <div className="w-full aspect-[4/1] md:aspect-[8/1] flex items-center justify-center relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <span className="text-[10px] uppercase font-bold text-muted-foreground/40 tracking-widest mb-1">Publicidade</span>
                        <span className="text-xs text-muted-foreground/60 font-mono italic">
                            Full Width - {slot}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Full Width Sidebar Ad
// Recommended for Media Kit: 400x300px (Max Width)
export function SidebarAd({ slot }: { slot: string }) {
    return (
        <div className="w-full flex flex-col items-center justify-center bg-muted/20 border border-border/50 rounded-xl overflow-hidden p-0 text-center group transition-all hover:border-primary/30">
            {/* Full Width MREC Container */}
            <div className="w-full aspect-[4/3] bg-muted/10 flex items-center justify-center relative overflow-hidden group-hover:bg-muted/20 transition-colors">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <div className="text-[9px] uppercase font-bold text-muted-foreground/40 mb-1 tracking-widest">Publicidade</div>
                    <span className="text-xs text-muted-foreground/60 font-mono italic">Full Width - {slot}</span>
                </div>
            </div>
        </div>
    );
}
