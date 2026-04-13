import React, { useState, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, Upload, ChevronLeft, ChevronRight, AlertCircle, Briefcase } from 'lucide-react';
import { cn, sanitizeInput } from '@/lib/utils';
import { api } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

// ── Step metadata ──────────────────────────────────────────────────
const STEPS = [
  { id: 1, label: 'Upload\nresume' },
  { id: 2, label: 'Profile\nDetails' },
  { id: 3, label: 'Previous\nEmployment' },
  { id: 4, label: 'Certifications/\nLicenses' },
  { id: 5, label: 'Job-Specific\nInformation' },
  { id: 6, label: 'Review &\nSubmit' },
];

// ── Stepper component ──────────────────────────────────────────────
const Stepper = ({ current }: { current: number }) => (
  <div className="flex items-start justify-center w-full mb-10 select-none">
    {STEPS.map((step, idx) => {
      const done = current > step.id;
      const active = current === step.id;
      return (
        <React.Fragment key={step.id}>
          {/* Node */}
          <div className="flex flex-col items-center gap-1 min-w-[60px]">
            <div
              className={cn(
                'w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition-colors',
                done
                  ? 'bg-primary border-primary text-white'
                  : active
                  ? 'bg-primary border-primary text-white'
                  : 'bg-white border-muted-foreground/40 text-muted-foreground',
              )}
            >
              {done ? <CheckCircle2 className="w-4 h-4" /> : step.id}
            </div>
            <span
              className={cn(
                'text-[10px] text-center leading-tight whitespace-pre-line',
                active ? 'text-primary font-medium' : 'text-muted-foreground',
              )}
            >
              {step.label}
            </span>
          </div>
          {/* Connector */}
          {idx < STEPS.length - 1 && (
            <div
              className={cn(
                'flex-1 h-0.5 mt-4 mx-1 transition-colors',
                current > step.id ? 'bg-primary' : 'bg-muted-foreground/20',
              )}
            />
          )}
        </React.Fragment>
      );
    })}
  </div>
);

// ── Form data shape ────────────────────────────────────────────────
interface FormData {
  // Step 1
  resumeFile: File | null;
  resumeName: string;

  // Step 2
  suffix: string;
  firstName: string;
  lastName: string;
  mobile: string;
  alternateMobile: string;
  email: string;
  address: string;
  state: string;
  city: string;
  country: string;
  highestGraduation: string;
  gender: string;
  languages: string[];
  jobAlert: boolean;

  // Step 3
  isFreshGraduate: boolean;
  employments: {
    company: string;
    title: string;
    startDate: string;
    endDate: string;
    currentlyWorking: boolean;
    responsibilities: string;
  }[];

  // Step 4
  certifications: { name: string; issuer: string; year: string }[];

  // Step 5
  coverLetter: string;
  salaryIsCommission: boolean;
  expectedSalary: string;
  noticePeriod: string;
  referral: string;
  howDidYouHear: string;

  // Meta
  jobId: string;
}

const EMPTY_EMPLOYMENT = {
  company: '',
  title: '',
  startDate: '',
  endDate: '',
  currentlyWorking: false,
  responsibilities: '',
};

const EMPTY_CERT = { name: '', issuer: '', year: '' };

const DEFAULT_FORM: FormData = {
  resumeFile: null,
  resumeName: '',
  suffix: '',
  firstName: '',
  lastName: '',
  mobile: '',
  alternateMobile: '',
  email: '',
  address: '',
  state: '',
  city: '',
  country: '',
  highestGraduation: '',
  gender: '',
  languages: [],
  jobAlert: true,
  isFreshGraduate: false,
  employments: [{ ...EMPTY_EMPLOYMENT }],
  certifications: [{ ...EMPTY_CERT }],
  coverLetter: '',
  salaryIsCommission: false,
  expectedSalary: '',
  noticePeriod: '',
  referral: '',
  howDidYouHear: '',
  jobId: '',
};

// ── Validation per step ────────────────────────────────────────────
const SCRIPT_PATTERN = /<script|javascript:|on\w+\s*=/i;

function validateStep(step: number, form: FormData): string[] {
  const errors: string[] = [];
  if (step === 1) {
    if (!form.resumeFile) errors.push('Please upload your resume.');
  }
  if (step === 2) {
    if (!form.firstName.trim()) errors.push('First name is required.');
    if (form.firstName.length > 100) errors.push('First name must be less than 100 characters.');
    if (SCRIPT_PATTERN.test(form.firstName)) errors.push('First name contains invalid characters.');
    if (!form.lastName.trim()) errors.push('Last name is required.');
    if (form.lastName.length > 100) errors.push('Last name must be less than 100 characters.');
    if (SCRIPT_PATTERN.test(form.lastName)) errors.push('Last name contains invalid characters.');
    if (!form.mobile.trim()) errors.push('Mobile number is required.');
    if (!/^[\d\s\-+().]{1,20}$/.test(form.mobile)) errors.push('Mobile number can only contain numbers and basic punctuation.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.push('Valid email is required.');
    if (form.email.length > 255) errors.push('Email must be less than 255 characters.');
    if (!form.gender) errors.push('Please select a gender.');
    if (form.address && form.address.length > 300) errors.push('Address must be less than 300 characters.');
    if (form.address && SCRIPT_PATTERN.test(form.address)) errors.push('Address contains invalid characters.');
  }
  if (step === 5) {
    if (!form.coverLetter.trim()) errors.push('Cover letter / additional notes are required.');
    if (form.coverLetter.length > 5000) errors.push('Cover letter must be less than 5000 characters.');
    if (SCRIPT_PATTERN.test(form.coverLetter)) errors.push('Cover letter contains invalid content.');
  }
  return errors;
}

// ── Main page component ────────────────────────────────────────────
const JobApply = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData>({ ...DEFAULT_FORM, jobId: id ?? '' });
  const [errors, setErrors] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Helpers ──────────────────────────────────────────────────────
  const set = <K extends keyof FormData>(key: K, value: FormData[K]) =>
    setForm(prev => ({ ...prev, [key]: value }));

  const toggleLanguage = (lang: string) =>
    set('languages', form.languages.includes(lang)
      ? form.languages.filter(l => l !== lang)
      : [...form.languages, lang]);

  const goNext = () => {
    const errs = validateStep(step, form);
    if (errs.length) { setErrors(errs); return; }
    setErrors([]);
    setStep(s => Math.min(s + 1, 6));
  };

  const goPrev = () => { setErrors([]); setStep(s => Math.max(s - 1, 1)); };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (!file) return;
    set('resumeFile', file);
    set('resumeName', file.name);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const payload = new FormData();
      // Don't send fallback job IDs — they don't exist in the database
      if (form.jobId && !form.jobId.startsWith('fallback-')) {
        payload.append('job_id', form.jobId);
      }
      if (form.resumeFile) payload.append('resume', form.resumeFile);
      payload.append('applicant_data', JSON.stringify({
        suffix: form.suffix,
        first_name: sanitizeInput(form.firstName),
        last_name: sanitizeInput(form.lastName),
        mobile: sanitizeInput(form.mobile),
        alternate_mobile: sanitizeInput(form.alternateMobile),
        email: form.email.trim(),
        address: sanitizeInput(form.address),
        state: sanitizeInput(form.state),
        city: sanitizeInput(form.city),
        country: sanitizeInput(form.country),
        highest_graduation: form.highestGraduation,
        gender: form.gender,
        languages: form.languages,
        job_alert: form.jobAlert,
        previous_employment: form.isFreshGraduate ? [] : form.employments.map(emp => ({
          ...emp,
          company: sanitizeInput(emp.company),
          title: sanitizeInput(emp.title),
          responsibilities: sanitizeInput(emp.responsibilities),
        })),
        certifications: form.certifications.map(cert => ({
          name: sanitizeInput(cert.name),
          issuer: sanitizeInput(cert.issuer),
          year: cert.year,
        })),
        cover_letter: sanitizeInput(form.coverLetter),
        expected_salary: form.salaryIsCommission ? 'Commission Based' : sanitizeInput(form.expectedSalary),
        notice_period: form.noticePeriod,
        referral: sanitizeInput(form.referral),
        how_did_you_hear: sanitizeInput(form.howDidYouHear),
      }));

      const { error } = await api.upload('/job_applications', payload);

      if (error) throw new Error(typeof error === 'string' ? error : (error?.message ?? 'Submission failed'));
      setSubmitted(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Submission failed. Please try again.';
      toast({ title: 'Submission failed', description: msg, variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  // ── Success screen ───────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
        <Navigation />
        <main className="pt-24 pb-20">
          <div className="container mx-auto px-4 max-w-xl text-center">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold mb-3">Application Submitted!</h1>
            <p className="text-muted-foreground mb-8">
              Thank you for applying. We will review your application and get back to you soon.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button variant="outline" onClick={() => navigate('/careers')}>
                Back to Careers
              </Button>
              <Button onClick={() => navigate('/')}>
                Go to Home
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // ── Step content ─────────────────────────────────────────────────
  const renderStep = () => {
    switch (step) {
      // ── Step 1: Upload Resume ──────────────────────────────────
      case 1:
        return (
          <div className="space-y-6">
            <div
              className={cn(
                'border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors',
                form.resumeFile ? 'border-primary bg-primary/5' : 'border-muted-foreground/30 hover:border-primary/60',
              )}
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />
              {form.resumeFile ? (
                <>
                  <p className="font-medium text-primary">{form.resumeName}</p>
                  <p className="text-sm text-muted-foreground mt-1">Click to replace</p>
                </>
              ) : (
                <>
                  <p className="font-medium">Drag &amp; drop your resume here</p>
                  <p className="text-sm text-muted-foreground mt-1">or click to browse — PDF, DOC, DOCX (max 5 MB)</p>
                </>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
          </div>
        );

      // ── Step 2: Profile Details ────────────────────────────────
      case 2:
        return (
          <div className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label>Suffix:</Label>
                <Select value={form.suffix} onValueChange={v => set('suffix', v)}>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    {['Mr.', 'Ms.', 'Mrs.', 'Dr.', 'Prof.'].map(s => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>First Name: <span className="text-destructive">*</span></Label>
                <Input value={form.firstName} onChange={e => set('firstName', e.target.value)} placeholder="First name" />
              </div>
              <div className="space-y-1.5">
                <Label>Last Name: <span className="text-destructive">*</span></Label>
                <Input value={form.lastName} onChange={e => set('lastName', e.target.value)} placeholder="Last name" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label>Mobile Number: <span className="text-destructive">*</span></Label>
                <Input value={form.mobile} onChange={e => set('mobile', e.target.value)} placeholder="Mobile number" />
              </div>
              <div className="space-y-1.5">
                <Label>Alternate Mobile Number:</Label>
                <Input value={form.alternateMobile} onChange={e => set('alternateMobile', e.target.value)} placeholder="Alternate number" />
              </div>
              <div className="space-y-1.5">
                <Label>Email ID: <span className="text-destructive">*</span></Label>
                <Input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="email@example.com" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label>Address:</Label>
                <Input value={form.address} onChange={e => set('address', e.target.value)} placeholder="Street address" />
              </div>
              <div className="space-y-1.5">
                <Label>State:</Label>
                <Input value={form.state} onChange={e => set('state', e.target.value)} placeholder="State / Province" />
              </div>
              <div className="space-y-1.5">
                <Label>City:</Label>
                <Input value={form.city} onChange={e => set('city', e.target.value)} placeholder="City" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Country:</Label>
                <Input value={form.country} onChange={e => set('country', e.target.value)} placeholder="Country" />
              </div>
              <div className="space-y-1.5">
                <Label>Highest Graduation Completed:</Label>
                <Select value={form.highestGraduation} onValueChange={v => set('highestGraduation', v)}>
                  <SelectTrigger><SelectValue placeholder="Select degree" /></SelectTrigger>
                  <SelectContent>
                    {[
                      'High School Diploma',
                      'Associate Degree',
                      'Bachelor of Arts',
                      'Bachelor of Science',
                      'Master of Arts',
                      'Master of Science',
                      'Master of Business Administration',
                      'Master of Design',
                      'Doctor of Philosophy',
                      'Other',
                    ].map(d => (
                      <SelectItem key={d} value={d}>{d}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Gender: <span className="text-destructive">*</span></Label>
                <RadioGroup
                  value={form.gender}
                  onValueChange={v => set('gender', v)}
                  className="flex flex-wrap gap-4"
                >
                  {['Male', 'Female', 'Others'].map(g => (
                    <div key={g} className="flex items-center gap-2">
                      <RadioGroupItem value={g} id={`gender-${g}`} />
                      <Label htmlFor={`gender-${g}`} className="font-normal cursor-pointer">{g}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label>Languages Known:</Label>
                <div className="flex flex-wrap gap-4">
                  {['Filipino', 'English', 'Bisaya', 'Ilocano', 'Other'].map(lang => (
                    <div key={lang} className="flex items-center gap-2">
                      <Checkbox
                        id={`lang-${lang}`}
                        checked={form.languages.includes(lang)}
                        onCheckedChange={() => toggleLanguage(lang)}
                        className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                      />
                      <Label htmlFor={`lang-${lang}`} className="font-normal cursor-pointer">{lang}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <Switch
                id="jobAlert"
                checked={form.jobAlert}
                onCheckedChange={v => set('jobAlert', v)}
              />
              <Label htmlFor="jobAlert" className="font-medium cursor-pointer">
                Job Alert is {form.jobAlert ? 'On' : 'Off'}
              </Label>
            </div>
            {form.jobAlert && (
              <p className="text-xs text-amber-600 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5" />
                This Job Alert will notify you about our company further Job Openings
              </p>
            )}
          </div>
        );

      // ── Step 3: Previous Employment ────────────────────────────
      case 3:
        return (
          <div className="space-y-6">
            {/* Fresh Graduate / Has Experience toggle */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => set('isFreshGraduate', true)}
                className={cn(
                  'flex-1 py-3 rounded-xl border-2 font-medium text-sm transition-colors',
                  form.isFreshGraduate
                    ? 'border-primary bg-primary text-white'
                    : 'border-muted-foreground/30 hover:border-primary/60',
                )}
              >
                Fresh Graduate
              </button>
              <button
                type="button"
                onClick={() => set('isFreshGraduate', false)}
                className={cn(
                  'flex-1 py-3 rounded-xl border-2 font-medium text-sm transition-colors',
                  !form.isFreshGraduate
                    ? 'border-primary bg-primary text-white'
                    : 'border-muted-foreground/30 hover:border-primary/60',
                )}
              >
                Has Experience
              </button>
            </div>

            {form.isFreshGraduate ? (
              <div className="rounded-xl border border-dashed border-muted-foreground/30 p-8 text-center text-muted-foreground">
                <p className="text-sm">No work experience required — you're applying as a fresh graduate.</p>
              </div>
            ) : (
              <>
            {form.employments.map((emp, idx) => (
              <Card key={idx}>
                <CardContent className="pt-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm text-muted-foreground">
                      Employment {idx + 1}
                    </span>
                    {form.employments.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive h-7 px-2"
                        onClick={() => set('employments', form.employments.filter((_, i) => i !== idx))}
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label>Company Name:</Label>
                      <Input value={emp.company} onChange={e => {
                        const updated = [...form.employments];
                        updated[idx] = { ...updated[idx], company: e.target.value };
                        set('employments', updated);
                      }} placeholder="Company name" />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Job Title:</Label>
                      <Input value={emp.title} onChange={e => {
                        const updated = [...form.employments];
                        updated[idx] = { ...updated[idx], title: e.target.value };
                        set('employments', updated);
                      }} placeholder="Your title" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label>Start Date:</Label>
                      <Input type="month" value={emp.startDate} onChange={e => {
                        const updated = [...form.employments];
                        updated[idx] = { ...updated[idx], startDate: e.target.value };
                        set('employments', updated);
                      }} />
                    </div>
                    <div className="space-y-1.5">
                      <Label>End Date:</Label>
                      <Input
                        type="month"
                        value={emp.endDate}
                        disabled={emp.currentlyWorking}
                        onChange={e => {
                          const updated = [...form.employments];
                          updated[idx] = { ...updated[idx], endDate: e.target.value };
                          set('employments', updated);
                        }}
                      />
                      <div className="flex items-center gap-2 mt-1">
                        <Checkbox
                          id={`current-${idx}`}
                          checked={emp.currentlyWorking}
                          onCheckedChange={v => {
                            const updated = [...form.employments];
                            updated[idx] = { ...updated[idx], currentlyWorking: !!v, endDate: v ? '' : updated[idx].endDate };
                            set('employments', updated);
                          }}
                        />
                        <Label htmlFor={`current-${idx}`} className="text-xs font-normal cursor-pointer">
                          Currently working here
                        </Label>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label>Responsibilities / Achievements:</Label>
                    <Textarea
                      value={emp.responsibilities}
                      onChange={e => {
                        const updated = [...form.employments];
                        updated[idx] = { ...updated[idx], responsibilities: e.target.value };
                        set('employments', updated);
                      }}
                      placeholder="Describe your key responsibilities..."
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => set('employments', [...form.employments, { ...EMPTY_EMPLOYMENT }])}
            >
              + Add Another Employment
            </Button>
              </>
            )}
          </div>
        );

      // ── Step 4: Certifications / Licenses ─────────────────────
      case 4:
        return (
          <div className="space-y-6">
            {form.certifications.map((cert, idx) => (
              <Card key={idx}>
                <CardContent className="pt-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm text-muted-foreground">
                      Certification / License {idx + 1}
                    </span>
                    {form.certifications.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive h-7 px-2"
                        onClick={() => set('certifications', form.certifications.filter((_, i) => i !== idx))}
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <Label>Certification / License Name:</Label>
                      <Input value={cert.name} onChange={e => {
                        const updated = [...form.certifications];
                        updated[idx] = { ...updated[idx], name: e.target.value };
                        set('certifications', updated);
                      }} placeholder="e.g. PMP, AWS SAA" />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Issuing Organization:</Label>
                      <Input value={cert.issuer} onChange={e => {
                        const updated = [...form.certifications];
                        updated[idx] = { ...updated[idx], issuer: e.target.value };
                        set('certifications', updated);
                      }} placeholder="e.g. PMI, Amazon" />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Year Obtained:</Label>
                      <Input value={cert.year} onChange={e => {
                        const updated = [...form.certifications];
                        updated[idx] = { ...updated[idx], year: e.target.value };
                        set('certifications', updated);
                      }} placeholder="e.g. 2023" maxLength={4} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => set('certifications', [...form.certifications, { ...EMPTY_CERT }])}
            >
              + Add Another Certification
            </Button>
          </div>
        );

      // ── Step 5: Job-Specific Information ──────────────────────────
      case 5:
        return (
          <div className="space-y-5">
            <div className="space-y-1.5">
              <Label>Cover Letter / Additional Notes: <span className="text-destructive">*</span></Label>
              <Textarea
                value={form.coverLetter}
                onChange={e => set('coverLetter', e.target.value)}
                placeholder="Tell us why you're a great fit for this role..."
                rows={5}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Expected Salary (PHP / month):</Label>
                <div className="flex gap-2 mb-2">
                  <button
                    type="button"
                    onClick={() => set('salaryIsCommission', false)}
                    className={cn(
                      'flex-1 py-2 rounded-lg border-2 text-xs font-medium transition-colors',
                      !form.salaryIsCommission
                        ? 'border-primary bg-primary text-white'
                        : 'border-muted-foreground/30 hover:border-primary/60',
                    )}
                  >
                    Fixed Monthly
                  </button>
                  <button
                    type="button"
                    onClick={() => { set('salaryIsCommission', true); set('expectedSalary', ''); }}
                    className={cn(
                      'flex-1 py-2 rounded-lg border-2 text-xs font-medium transition-colors',
                      form.salaryIsCommission
                        ? 'border-primary bg-primary text-white'
                        : 'border-muted-foreground/30 hover:border-primary/60',
                    )}
                  >
                    Commission Based
                  </button>
                </div>
                {!form.salaryIsCommission && (
                  <Input
                    value={form.expectedSalary}
                    onChange={e => set('expectedSalary', e.target.value)}
                    placeholder="e.g. 30,000"
                  />
                )}
                {form.salaryIsCommission && (
                  <p className="text-xs text-amber-600 flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5" />
                    You are open to a commission-based arrangement.
                  </p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label>Notice Period:</Label>
                <Select value={form.noticePeriod} onValueChange={v => set('noticePeriod', v)}>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    {['Immediately', '1 week', '2 weeks', '1 month', '2 months', '3 months+'].map(n => (
                      <SelectItem key={n} value={n}>{n}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Referral (if referred by an employee):</Label>
              <Input value={form.referral} onChange={e => set('referral', e.target.value)} placeholder="Referrer name" />
            </div>

            <div className="space-y-1.5">
              <Label>How did you hear about us?</Label>
              <Select value={form.howDidYouHear} onValueChange={v => set('howDidYouHear', v)}>
                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  {['Company website', 'LinkedIn', 'Facebook', 'Jobstreet', 'Indeed', 'Referral', 'Job fair', 'Other'].map(h => (
                    <SelectItem key={h} value={h}>{h}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      // ── Step 6: Review & Submit ────────────────────────────────────
      case 6:
        return (
          <div className="space-y-6">
            <p className="text-muted-foreground text-sm">
              Please review your application before submitting. Use the <strong>Previous</strong> button to go back and make changes.
            </p>

            {/* Summary cards */}
            {[
              {
                title: 'Resume',
                rows: [['File', form.resumeName || '—']],
              },
              {
                title: 'Profile Details',
                rows: [
                  ['Name', `${form.suffix} ${form.firstName} ${form.lastName}`.trim() || '—'],
                  ['Mobile', form.mobile || '—'],
                  ['Email', form.email || '—'],
                  ['Location', [form.city, form.state, form.country].filter(Boolean).join(', ') || '—'],
                  ['Graduation', form.highestGraduation || '—'],
                  ['Gender', form.gender || '—'],
                  ['Languages', form.languages.join(', ') || '—'],
                ],
              },
              {
                title: 'Previous Employment',
                rows: form.employments.filter(e => e.company).length
                  ? form.employments.filter(e => e.company).map(e => [e.company, `${e.title || 'Role'} (${e.startDate || '?'} – ${e.currentlyWorking ? 'Present' : e.endDate || '?'})`])
                  : [['', 'No previous employment added']],
              },
              {
                title: 'Certifications / Licenses',
                rows: form.certifications.filter(c => c.name).length
                  ? form.certifications.filter(c => c.name).map(c => [c.name, `${c.issuer || ''} ${c.year || ''}`.trim()])
                  : [['', 'None added']],
              },
              {
                title: 'Job-Specific',
                rows: [
                  ['Expected Salary', form.salaryIsCommission ? 'Commission Based' : (form.expectedSalary || '—')],
                  ['Notice Period', form.noticePeriod || '—'],
                  ['Referral', form.referral || '—'],
                  ['How did you hear', form.howDidYouHear || '—'],
                  ['Cover Letter', form.coverLetter ? form.coverLetter.slice(0, 100) + (form.coverLetter.length > 100 ? '…' : '') : '—'],
                ],
              },
            ].map(section => (
              <Card key={section.title}>
                <CardContent className="pt-4">
                  <h3 className="font-semibold text-sm text-primary mb-3">{section.title}</h3>
                  <dl className="space-y-1.5">
                    {section.rows.map(([label, value], i) => (
                      <div key={i} className="grid grid-cols-[140px_1fr] gap-2 text-sm">
                        <dt className="text-muted-foreground truncate">{label}</dt>
                        <dd className="font-medium break-words">{value}</dd>
                      </div>
                    ))}
                  </dl>
                </CardContent>
              </Card>
            ))}

            <p className="text-xs text-muted-foreground">
              By submitting this application you agree that the information provided is accurate and complete.
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  // ── Layout ───────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <Navigation />

      <main className="pt-20 pb-20">
        <div className="container mx-auto px-4 max-w-3xl">
          {/* Back link */}
          <div className="mb-6">
            <Link
              to={id ? `/job/${id}` : '/careers'}
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Back to Job Listing
            </Link>
          </div>

          {/* Stepper */}
          <Stepper current={step} />

          {/* Card */}
          <div className="bg-white dark:bg-card rounded-2xl shadow-sm border p-6 sm:p-8">
            {/* Section title */}
            <div className="flex items-center gap-2 mb-6">
              <Briefcase className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-bold">{STEPS[step - 1].label.replace('\n', ' ')}</h2>
            </div>

            {/* Validation errors */}
            {errors.length > 0 && (
              <div className="mb-5 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                {errors.map((e, i) => (
                  <p key={i} className="text-sm text-destructive flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                    {e}
                  </p>
                ))}
              </div>
            )}

            {/* Step content */}
            {renderStep()}

            {/* Navigation buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t">
              <Button
                variant="outline"
                onClick={goPrev}
                disabled={step === 1}
                className="gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Button>

              {step < 6 ? (
                <Button onClick={goNext} className="gap-1">
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="gap-1 bg-primary"
                >
                  {submitting ? 'Submitting…' : 'Submit Application'}
                  {!submitting && <CheckCircle2 className="w-4 h-4" />}
                </Button>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default JobApply;
