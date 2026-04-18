import * as React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface TrailCardProps extends React.HTMLAttributes<HTMLDivElement> {
  imageUrl: string;
  mapImageUrl: string;
  title: string;
  location: string;
  difficulty: string;
  creators: string;
  distance: string;
  elevation: string;
  duration: string;
  onDirectionsClick?: () => void;
}

const StatItem = ({ label, value }: { label: string; value: string }) => (
  <div className="flex min-w-0 flex-1 flex-col">
    <span className="truncate text-sm font-semibold text-slate-800">{value}</span>
    <span className="text-[11px] uppercase tracking-wide text-slate-500">
      {label}
    </span>
  </div>
);

const TrailCard = React.forwardRef<HTMLDivElement, TrailCardProps>(
  (
    {
      className,
      imageUrl,
      mapImageUrl,
      title,
      location,
      difficulty,
      creators,
      distance,
      elevation,
      duration,
      onDirectionsClick,
      ...props
    },
    ref
  ) => {
    return (
      <motion.div
        ref={ref}
        className={cn(
          "group w-full overflow-hidden rounded-[28px] border border-teal-100 bg-white text-slate-900 shadow-[0_18px_45px_-24px_rgba(15,118,110,0.35)]",
          className
        )}
        whileHover={{ y: -6, scale: 1.01 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        {...props}
      >
        <div className="relative h-56 w-full overflow-hidden">
          <img
            src={imageUrl}
            alt={title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/30 to-teal-900/10" />
          <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/15 to-transparent" />

          <div className="absolute left-4 right-4 top-4 flex items-start justify-between gap-3">
            <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-teal-700 shadow-sm">
              {location}
            </span>
            <img
              src={mapImageUrl}
              alt={`${title} visual summary`}
              className="h-10 w-20 rounded-xl bg-white/90 object-contain px-2 py-1 shadow-sm"
            />
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-4">
            <div className="flex items-end justify-between gap-4">
              <div className="min-w-0 text-white">
                <h3 className="truncate text-2xl font-bold">{title}</h3>
                <p className="mt-1 text-sm text-white/85">{difficulty}</p>
              </div>

              <motion.div
                initial={{ opacity: 0, x: 16 }}
                whileHover={{ opacity: 1, x: 0 }}
                className="hidden md:block"
              >
                <Button
                  variant="secondary"
                  className="bg-white/95 text-teal-700 shadow-sm hover:bg-white"
                  onClick={(event) => {
                    event.stopPropagation();
                    onDirectionsClick?.();
                  }}
                  aria-label={`Open details for ${title}`}
                >
                  Details
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </motion.div>
            </div>
          </div>
        </div>

        <div className="p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="truncate font-semibold text-slate-800">{creators}</p>
              <p className="mt-1 text-xs leading-5 text-slate-500">{difficulty}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="shrink-0 text-teal-700 hover:bg-teal-50 hover:text-teal-800 md:hidden"
              onClick={(event) => {
                event.stopPropagation();
                onDirectionsClick?.();
              }}
            >
              Details
            </Button>
          </div>

          <div className="my-4 h-px w-full bg-slate-100" />
          <div className="flex gap-3">
            <StatItem label="Courses" value={distance} />
            <StatItem label="Skills" value={elevation} />
            <StatItem label="Salary" value={duration} />
          </div>
        </div>
      </motion.div>
    );
  }
);

TrailCard.displayName = "TrailCard";

export { TrailCard };
