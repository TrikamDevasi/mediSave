import { createFileRoute } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, Code2, MapPin } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";


export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact MediSave" },
      { name: "description", content: "Get in touch with the MediSave team — feedback, partnerships, bug reports." },
      { property: "og:title", content: "Contact MediSave" },
      { property: "og:description", content: "We'd love to hear from you." },
    ],
  }),
  component: ContactPage,
});

const schema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(80),
  email: z.string().trim().email("Enter a valid email").max(160),
  subject: z.enum(["Feedback", "Bug Report", "Partnership", "Other"]),
  message: z.string().trim().min(20, "Message must be at least 20 characters").max(1000),
});

type FormData = z.infer<typeof schema>;

function ContactPage() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, touchedFields },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { subject: "Feedback" },
    mode: "onTouched",
  });

  const onSubmit = async (_data: FormData) => {
    await new Promise((r) => setTimeout(r, 600));
    toast.success("Message sent! We'll respond within 24 hours.");
    reset();
  };

  const fieldClass = (name: keyof FormData) =>
    `w-full rounded-lg border bg-white px-3 py-2.5 text-sm outline-none transition-colors focus:ring-2 focus:ring-primary/30 ${
      errors[name]
        ? "border-destructive"
        : touchedFields[name]
        ? "border-success"
        : "border-border"
    }`;

  return (
    <div>
      <div className="px-4 pt-5">
        <h1 className="text-2xl font-bold text-primary">Contact Us</h1>
        <p className="text-sm text-mutedfg">We'd love to hear from you.</p>

        <motion.form
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit(onSubmit)}
          className="mt-4 space-y-4 rounded-2xl bg-white p-5 shadow-md"
        >
          <div>
            <label className="mb-1 block text-xs font-semibold text-foreground">Full Name</label>
            <input {...register("name")} className={fieldClass("name")} placeholder="Trikam Devasi" />
            {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name.message}</p>}
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-foreground">Email</label>
            <input
              type="email"
              {...register("email")}
              className={fieldClass("email")}
              placeholder="you@example.com"
            />
            {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email.message}</p>}
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-foreground">Subject</label>
            <select {...register("subject")} className={fieldClass("subject")}>
              <option>Feedback</option>
              <option>Bug Report</option>
              <option>Partnership</option>
              <option>Other</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-foreground">Message</label>
            <textarea
              rows={5}
              {...register("message")}
              className={fieldClass("message")}
              placeholder="Tell us what's on your mind..."
            />
            {errors.message && <p className="mt-1 text-xs text-destructive">{errors.message.message}</p>}
          </div>

          <motion.button
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-full bg-primary py-3 font-semibold text-primary-foreground hover:bg-primary-dark disabled:opacity-60"
          >
            {isSubmitting ? "Sending..." : "Send Message"}
          </motion.button>
        </motion.form>

        <div className="mt-5 grid gap-3 pb-6 md:grid-cols-3">
          {[
            { Icon: Mail, label: "Email", value: "hello@medisave.in" },
            { Icon: Code2, label: "GitHub", value: "github.com/TrikamDevasi/medisave" },
            { Icon: MapPin, label: "Location", value: "Ahmedabad, Gujarat, India" },
          ].map(({ Icon, label, value }) => (
            <div key={label} className="rounded-xl bg-white p-4 shadow-sm">
              <div className="flex items-center gap-2 text-xs font-semibold text-mutedfg">
                <Icon className="h-4 w-4 text-primary" /> {label}
              </div>
              <div className="mt-1 text-sm font-medium text-foreground break-words">{value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
