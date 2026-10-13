"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ShuffleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ChatAvatar } from "@/components/chat-avatar";
import { updateBot, deleteBot } from "@/actions/bot";
import { insertBotSchema } from "@/lib/schema";
import { toast } from "@/components/ui/toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type BotFormData = z.infer<typeof insertBotSchema>;

const JOB_PRESETS: { label: string; instructions: string }[] = [
  {
    label: "Research assistant",
    instructions:
      "Answer briefly, cite sources, and ask before running anything destructive.",
  },
  {
    label: "Code reviewer",
    instructions:
      "Review for correctness, readability, and edge cases. Be concise and suggest specific improvements.",
  },
  {
    label: "Writing editor",
    instructions:
      "Improve clarity and flow while preserving the author's voice. Flag any factual claims that need verification.",
  },
  {
    label: "Tutor",
    instructions:
      "Explain concepts step by step. Ask questions to check understanding before moving on.",
  },
];

interface BotEditDialogProps {
  bot: {
    id: string;
    name: string;
    avatar: string;
    job: string;
    instructions: string | null;
  };
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BotEditDialog({ bot, open, onOpenChange }: BotEditDialogProps) {
  const [seed, setSeed] = useState(bot.avatar);
  const [isDeleting, setIsDeleting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BotFormData>({
    resolver: zodResolver(insertBotSchema),
    defaultValues: {
      name: bot.name,
      job: bot.job,
      instructions: bot.instructions ?? "",
      avatar: bot.avatar,
    },
  });

  const currentJob = watch("job");

  function handleShuffle() {
    const next = Math.random().toString(36).slice(2);
    setSeed(next);
    setValue("avatar", next);
  }

  function handlePreset(preset: (typeof JOB_PRESETS)[number]) {
    setValue("job", preset.label, { shouldValidate: true });
    setValue("instructions", preset.instructions);
  }

  async function onSubmit(data: BotFormData) {
    const result = await updateBot(bot.id, data);
    if (result.success) {
      toast.add({ title: `${data.name} updated`, type: "success" });
      onOpenChange(false);
    } else {
      toast.add({ title: result.error ?? "Failed to update bot", type: "error" });
    }
  }

  async function handleDelete() {
    setIsDeleting(true);
    const result = await deleteBot(bot.id);
    setIsDeleting(false);
    if (result.success) {
      toast.add({ title: `${bot.name} deleted`, type: "success" });
      onOpenChange(false);
    } else {
      toast.add({ title: result.error ?? "Failed to delete bot", type: "error" });
    }
  }

  function handleOpenChange(next: boolean) {
    onOpenChange(next);
    if (!next) {
      reset();
      setSeed(bot.avatar);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent showCloseButton className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit bot</DialogTitle>
          <DialogDescription>
            Update {bot.name}&apos;s face, name, or job.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-wrap gap-1.5">
          {JOB_PRESETS.map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => handlePreset(preset)}
              className="rounded-full border px-3 py-1 text-xs transition-colors hover:bg-muted data-[active=true]:border-foreground data-[active=true]:bg-foreground data-[active=true]:text-background"
              data-active={currentJob === preset.label}
            >
              {preset.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <ChatAvatar key={seed} seed={seed} className="size-10 shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-medium">Face</p>
            <p className="text-sm text-muted-foreground">
              Shuffle until you find one you like.
            </p>
          </div>
          <Button type="button" variant="outline" size="sm" onClick={handleShuffle}>
            <ShuffleIcon data-icon="inline-start" />
            Shuffle
          </Button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            <Field data-invalid={!!errors.name}>
              <FieldLabel htmlFor="bot-name">Name</FieldLabel>
              <Input
                id="bot-name"
                placeholder="Ada"
                aria-invalid={!!errors.name}
                {...register("name")}
              />
              <FieldError errors={[errors.name]} />
            </Field>

            <Field data-invalid={!!errors.job}>
              <FieldLabel htmlFor="bot-job">Job</FieldLabel>
              <Input
                id="bot-job"
                placeholder="Research assistant"
                aria-invalid={!!errors.job}
                {...register("job")}
              />
              <FieldError errors={[errors.job]} />
            </Field>

            <Field>
              <FieldLabel htmlFor="bot-instructions">
                How it should work
              </FieldLabel>
              <Textarea
                id="bot-instructions"
                placeholder="Answer briefly, cite sources, and ask before running anything destructive."
                className="min-h-24 resize-none"
                {...register("instructions")}
              />
            </Field>
          </FieldGroup>

          <DialogFooter showCloseButton className="mt-4">
            <AlertDialog>
              <AlertDialogTrigger className="mr-auto"
                render={
                  <Button type="button" variant="destructive" disabled={isDeleting}>
                    {isDeleting ? "Deleting…" : "Delete bot"}
                  </Button>
                }
              />
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete {bot.name}?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete {bot.name} and all its chats. This cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving…" : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
