"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Dice6, Edit } from "lucide-react";
import { useEffect, useState } from "react";

interface CreateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (key: string) => void;
  isPending: boolean;
}

export const CreateModal = ({
  open,
  onOpenChange,
  onConfirm,
  isPending,
}: CreateModalProps) => {
  const [mode, setMode] = useState<"random" | "custom">("random");
  const [customKey, setCustomKey] = useState("");
  const [randomKey, setRandomKey] = useState("");

  const generateRandomKey = () => {
    const newKey = crypto.randomUUID();
    setRandomKey(newKey);
  };

  useEffect(() => {
    if (open && !randomKey) {
      generateRandomKey();
    }
  }, [open, randomKey]);

  const handleConfirm = () => {
    const keyToUse = mode === "random" ? randomKey : customKey;
    if (!keyToUse.trim()) {
      return;
    }
    onConfirm(keyToUse);
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen) {
      generateRandomKey();
      setCustomKey("");
      setMode("random");
    }
    onOpenChange(newOpen);
  };

  const isValid = mode === "random" ? !!randomKey : !!customKey.trim();

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>创建 API Key</DialogTitle>
          <DialogDescription>
            选择生成随机 Key 或输入自定义 Key
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <RadioGroup
            value={mode}
            onValueChange={(value) => setMode(value as "random" | "custom")}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="random" id="random" />
              <Label htmlFor="random" className="flex items-center gap-2">
                <Dice6 className="h-4 w-4" />
                随机生成
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="custom" id="custom" />
              <Label htmlFor="custom" className="flex items-center gap-2">
                <Edit className="h-4 w-4" />
                自定义输入
              </Label>
            </div>
          </RadioGroup>

          {mode === "random" ? (
            <div className="space-y-2">
              <Label>生成的 Key</Label>
              <div className="flex gap-2 items-center">
                <Input
                  value={randomKey}
                  readOnly
                  className="font-mono text-sm"
                />
                <Button variant="outline" onClick={generateRandomKey}>
                  重新生成
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="custom-key">自定义 Key</Label>
              <Input
                id="custom-key"
                value={customKey}
                onChange={(e) => setCustomKey(e.target.value)}
                placeholder="请输入 API Key"
                className="font-mono text-sm"
              />
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            取消
          </Button>
          <Button onClick={handleConfirm} disabled={!isValid || isPending}>
            {isPending ? "创建中..." : "创建"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
