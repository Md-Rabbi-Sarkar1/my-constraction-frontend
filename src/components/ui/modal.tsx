// 📄 components/ui/modal.tsx
"use client"

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
}: ModalProps) {
  return (
    // open এবং onOpenChange এর মাধ্যমে মোডাল ওপেন/ক্লোজ কন্ট্রোল করা হয়
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        {/* মোডালের ভেতরের মেইন কন্টেন্ট বা ফর্ম */}
        <div className="py-4">{children}</div>

        {/* ফুটারে অ্যাকশন বাটনসমূহ (যদি থাকে) */}
        {footer && <DialogFooter>{footer}</DialogFooter>}
        
      </DialogContent>
    </Dialog>
  );
}
