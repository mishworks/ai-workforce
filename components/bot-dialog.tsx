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
  DialogTrigger,
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
import { createBot } from "@/actions/bot";
import { insertBotSchema } from "@/lib/schema";
import { toast } from "@/components/ui/toast";

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

function randomSeed() {
  return Math.random().toString(36).slice(2);
}

interface BotDialogProps {
  children: React.ReactNode;
}

export function BotDialog({ children }: BotDialogProps) {
  const [open, setOpen] = useState(false);
  const [seed, setSeed] = useState(() => randomSeed());

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
      name: "",
      job: "",
      instructions: "",
      avatar: seed,
    },
  });

  const currentJob = watch("job");

  function handleShuffle() {
    const next = randomSeed();
    setSeed(next);
    setValue("avatar", next);
  }

  function handlePreset(preset: (typeof JOB_PRESETS)[number]) {
    setValue("job", preset.label, { shouldValidate: true });
    setValue("instructions", preset.instructions);
  }

  async function onSubmit(data: BotFormData) {
    const result = await createBot(data);
    if (result.success) {
      toast.add({ title: `${data.name} is ready`, type: "success" });
      setOpen(false);
      reset();
      setSeed(randomSeed());
    } else {
      toast.add({ title: result.error ?? "Failed to create bot", type: "error" });
    }
  }

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) {
      reset();
      const s = randomSeed();
      setSeed(s);
      setValue("avatar", s);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={children as React.ReactElement} />
      <DialogContent showCloseButton className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>New bot</DialogTitle>
          <DialogDescription>
            Give it a face, a name, and a job to do.
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
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating…" : "Create bot"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
