"use client";

import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { XIcon } from "lucide-react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

export default function ImageZoom({ src, alt, className }: any) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <img
          src={src}
          alt={alt}
          className={`cursor-zoom-in hover:opacity-90 transition-all ${className}`}
        />
      </DialogTrigger>

      <DialogContent
        showCloseButton={false}
        className="w-auto max-w-[90vw] max-h-[90vh] p-0 bg-transparent border-none shadow-none flex items-center justify-center"
      >
        {/* Hidden title for accessibility */}
        <VisuallyHidden>
          <DialogTitle>{alt || "Image preview"}</DialogTitle>
        </VisuallyHidden>
        <div className="relative">
          <DialogClose
            className="absolute -top-3 -right-3 rounded-full bg-black/60 text-white p-2 shadow-lg hover:bg-black/75 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <XIcon className="size-4" />
            <span className="sr-only">Close</span>
          </DialogClose>

          <img
            src={src}
            alt={alt}
            className="max-h-[90vh] max-w-[90vw] object-contain pointer-events-none rounded-lg"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
