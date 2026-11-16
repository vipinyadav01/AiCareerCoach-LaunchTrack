"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertTriangle,
  Download,
  Edit,
  Loader2,
  Monitor,
  Save,
} from "lucide-react";
import { toast } from "sonner";
import MDEditor from "@uiw/react-md-editor";
import { Button } from "@/components/ui/button";
import { FieldError, PageHeader, Screen } from "@/components/app/screen";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { saveResume } from "@/actions/resume";
import { EntryForm } from "./entry-form";
import useFetch from "@/hooks/use-fetch";
import { useNeonUser } from "@/hooks/use-neon-auth";
import { entriesToMarkdown } from "@/app/lib/helper";
import { resumeSchema } from "@/app/lib/schema";
import html2pdf from "html2pdf.js/dist/html2pdf.min.js";

export default function ResumeBuilder({ initialContent }) {
  const [activeTab, setActiveTab] = useState("edit");
  const [previewContent, setPreviewContent] = useState(initialContent);
  const { user } = useNeonUser();
  const [resumeMode, setResumeMode] = useState("preview");

  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resumeSchema),
    defaultValues: {
      contactInfo: {},
      summary: "",
      skills: "",
      experience: [],
      education: [],
      projects: [],
    },
  });

  const {
    loading: isSaving,
    fn: saveResumeFn,
    data: saveResult,
    error: saveError,
  } = useFetch(saveResume);

  // Watch form fields for preview updates
  const formValues = watch();

  useEffect(() => {
    if (initialContent) setActiveTab("preview");
  }, [initialContent]);

  // Update preview content when form values change
  useEffect(() => {
    if (activeTab === "edit") {
      const newContent = getCombinedContent();
      setPreviewContent(newContent ? newContent : initialContent);
    }
  }, [formValues, activeTab]);

  // Handle save result
  useEffect(() => {
    if (saveResult && !isSaving) {
      toast.success("Resume saved successfully!");
    }
    if (saveError) {
      toast.error(saveError.message || "Failed to save resume");
    }
  }, [saveResult, saveError, isSaving]);

  const getContactMarkdown = () => {
    const { contactInfo } = formValues;
    const parts = [];
    if (contactInfo.email) parts.push(contactInfo.email);
    if (contactInfo.mobile) parts.push(contactInfo.mobile);
    if (contactInfo.linkedin) parts.push(`[LinkedIn](${contactInfo.linkedin})`);
    if (contactInfo.twitter) parts.push(`[Twitter](${contactInfo.twitter})`);

    return parts.length > 0
      ? `## <div align="center">${user?.name || ""}</div>
        \n\n<div align="center">\n\n${parts.join(" | ")}\n\n</div>`
      : "";
  };

  const getCombinedContent = () => {
    const { summary, skills, experience, education, projects } = formValues;
    return [
      getContactMarkdown(),
      summary && `## Professional Summary\n\n${summary}`,
      skills && `## Skills\n\n${skills}`,
      entriesToMarkdown(experience, "Work Experience"),
      entriesToMarkdown(education, "Education"),
      entriesToMarkdown(projects, "Projects"),
    ]
      .filter(Boolean)
      .join("\n\n");
  };

  const [isGenerating, setIsGenerating] = useState(false);

  const generatePDF = async () => {
    setIsGenerating(true);
    try {
      const element = document.getElementById("resume-pdf");
      const opt = {
        margin: [15, 15],
        filename: "resume.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      };

      await html2pdf().set(opt).from(element).save();
    } catch (error) {
      console.error("PDF generation error:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      const formattedContent = previewContent
        .replace(/\n/g, "\n") // Normalize newlines
        .replace(/\n\s*\n/g, "\n\n") // Normalize multiple newlines to double newlines
        .trim();

      await saveResumeFn(previewContent);
    } catch (error) {
      console.error("Save error:", error);
    }
  };


  const contactFields = [
    { name: "email", label: "Email", type: "email", placeholder: "you@example.com", autoComplete: "email" },
    { name: "mobile", label: "Phone", type: "tel", placeholder: "+91 98765 43210", autoComplete: "tel" },
    { name: "linkedin", label: "LinkedIn", type: "url", placeholder: "https://linkedin.com/in/your-profile" },
    { name: "twitter", label: "X / Twitter", type: "url", placeholder: "https://x.com/your-handle" },
  ];

  const entrySections = [
    { name: "experience", title: "Work experience", help: "Most recent role first.", type: "Experience" },
    { name: "education", title: "Education", help: "Degrees, courses and certifications.", type: "Education" },
    { name: "projects", title: "Projects", help: "Work you can point to.", type: "Project" },
  ];

  return (
    <div data-color-mode="light">
      <Screen>
        <PageHeader
          title="Resume"
          description="Fill in the form, or switch to Markdown to edit the text directly. The PDF is made from the Markdown view."
          actions={
            <>
              <Button variant="outline" onClick={generatePDF} disabled={isGenerating}>
                {isGenerating ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                ) : (
                  <Download className="mr-2 h-4 w-4" aria-hidden="true" />
                )}
                {isGenerating ? "Preparing PDF" : "Download PDF"}
              </Button>
              <Button onClick={handleSubmit(onSubmit)} disabled={isSaving}>
                {isSaving ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                ) : (
                  <Save className="mr-2 h-4 w-4" aria-hidden="true" />
                )}
                {isSaving ? "Saving" : "Save"}
              </Button>
            </>
          }
        />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="gap-6">
          <TabsList>
            <TabsTrigger value="edit">Form</TabsTrigger>
            <TabsTrigger value="preview">Markdown</TabsTrigger>
          </TabsList>

          <TabsContent value="edit">
            <form onSubmit={handleSubmit(onSubmit)} className="divide-y rounded-xl border bg-card">
              <FormSection title="Contact" help="Shown at the top of your resume.">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {contactFields.map((f) => (
                    <div key={f.name} className="space-y-1.5">
                      <Label htmlFor={`contact-${f.name}`}>{f.label}</Label>
                      <Input
                        id={`contact-${f.name}`}
                        type={f.type}
                        placeholder={f.placeholder}
                        autoComplete={f.autoComplete}
                        aria-invalid={!!errors.contactInfo?.[f.name]}
                        {...register(`contactInfo.${f.name}`)}
                      />
                      <FieldError error={errors.contactInfo?.[f.name]} />
                    </div>
                  ))}
                </div>
              </FormSection>

              <FormSection title="Summary" help="Two or three sentences on who you are and what you do best.">
                <Label htmlFor="summary" className="sr-only">Professional summary</Label>
                <Controller
                  name="summary"
                  control={control}
                  render={({ field }) => (
                    <Textarea
                      {...field}
                      id="summary"
                      className="min-h-32"
                      placeholder="Product designer with six years of experience…"
                      aria-invalid={!!errors.summary}
                    />
                  )}
                />
                <FieldError error={errors.summary} />
              </FormSection>

              <FormSection title="Skills" help="Separate skills with commas.">
                <Label htmlFor="skills" className="sr-only">Skills</Label>
                <Controller
                  name="skills"
                  control={control}
                  render={({ field }) => (
                    <Textarea
                      {...field}
                      id="skills"
                      className="min-h-24"
                      placeholder="Figma, user research, prototyping"
                      aria-invalid={!!errors.skills}
                    />
                  )}
                />
                <FieldError error={errors.skills} />
              </FormSection>

              {entrySections.map((section) => (
                <FormSection key={section.name} title={section.title} help={section.help}>
                  <Controller
                    name={section.name}
                    control={control}
                    render={({ field }) => (
                      <EntryForm type={section.type} entries={field.value} onChange={field.onChange} />
                    )}
                  />
                  <FieldError error={errors[section.name]} />
                </FormSection>
              ))}
            </form>
          </TabsContent>

          <TabsContent value="preview" className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <Button
                variant="outline"
                size="sm"
                type="button"
                onClick={() => setResumeMode(resumeMode === "preview" ? "edit" : "preview")}
              >
                {resumeMode === "preview" ? (
                  <>
                    <Edit className="mr-2 h-4 w-4" aria-hidden="true" />
                    Edit Markdown
                  </>
                ) : (
                  <>
                    <Monitor className="mr-2 h-4 w-4" aria-hidden="true" />
                    Show preview
                  </>
                )}
              </Button>
            </div>

            {resumeMode !== "preview" && (
              <div
                role="status"
                className="flex items-start gap-2 rounded-lg border border-warning/30 bg-warning/5 px-3 py-2.5 text-sm text-warning"
              >
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                <span>Edits made here are replaced if you change the form afterwards.</span>
              </div>
            )}

            <div className="overflow-hidden rounded-xl border">
              <MDEditor value={previewContent} onChange={setPreviewContent} height={800} preview={resumeMode} />
            </div>
            <div className="hidden">
              <div id="resume-pdf">
                <MDEditor.Markdown source={previewContent} style={{ background: "white", color: "black" }} />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </Screen>
    </div>
  );
}

function FormSection({ title, help, children }) {
  return (
    <section className="grid grid-cols-1 gap-4 px-5 py-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,2.4fr)] lg:gap-10">
      <div className="space-y-1">
        <h2 className="text-base font-medium">{title}</h2>
        {help && <p className="text-sm text-muted-foreground">{help}</p>}
      </div>
      <div className="min-w-0 space-y-2">{children}</div>
    </section>
  );
}
