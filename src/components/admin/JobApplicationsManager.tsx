/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Trash2, Eye, FileText, Briefcase, ChevronLeft, ChevronRight } from 'lucide-react';
import { api } from '@/lib/api';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

interface JobApplication {
  id: string;
  job_id?: string;
  suffix?: string;
  first_name: string;
  last_name: string;
  mobile: string;
  alternate_mobile?: string;
  email: string;
  address?: string;
  state?: string;
  city?: string;
  country?: string;
  highest_graduation?: string;
  gender?: string;
  languages?: string[];
  job_alert?: boolean;
  previous_employment?: any[];
  certifications?: any[];
  willing_to_relocate?: string;
  preferred_locations?: string;
  open_to_remote?: string;
  travel_percentage?: string;
  cover_letter?: string;
  expected_salary?: string;
  notice_period?: string;
  referral?: string;
  how_did_you_hear?: string;
  resume_url?: string;
  status: string;
  notes?: string;
  created_at: string;
  updated_at?: string;
}

const STATUS_COLORS: Record<string, string> = {
  new: 'bg-blue-100 text-blue-700 border-blue-200',
  reviewing: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  shortlisted: 'bg-green-100 text-green-700 border-green-200',
  rejected: 'bg-red-100 text-red-700 border-red-200',
  hired: 'bg-emerald-100 text-emerald-700 border-emerald-200',
};

const ITEMS_PER_PAGE = 10;

const JobApplicationsManager = () => {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedApp, setSelectedApp] = useState<JobApplication | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [editStatus, setEditStatus] = useState('');
  const [editNotes, setEditNotes] = useState('');
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: applications = [], isLoading } = useQuery<JobApplication[]>({
    queryKey: ['job_applications', filterStatus],
    queryFn: async (): Promise<JobApplication[]> => {
      const params = filterStatus !== 'all' ? `?status=${filterStatus}` : '';
      const res = await api.get(`/job_applications${params}`);
      if (res.error) throw new Error(res.error?.message ?? 'Failed to load applications');
      return (res.data ?? []) as JobApplication[];
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, status, notes }: { id: string; status: string; notes: string }) => {
      const res = await api.put(`/job_applications/${id}`, { status, notes });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['job_applications'] });
      toast({ title: 'Application updated' });
      setDetailOpen(false);
    },
    onError: () => toast({ title: 'Update failed', variant: 'destructive' }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/job_applications/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['job_applications'] });
      toast({ title: 'Application deleted' });
      setDetailOpen(false);
    },
    onError: () => toast({ title: 'Delete failed', variant: 'destructive' }),
  });

  const openDetail = (app: JobApplication) => {
    setSelectedApp(app);
    setEditStatus(app.status);
    setEditNotes(app.notes || '');
    setDetailOpen(true);
  };

  const handleSave = () => {
    if (!selectedApp) return;
    updateMutation.mutate({ id: selectedApp.id, status: editStatus, notes: editNotes });
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this application? This cannot be undone.')) {
      deleteMutation.mutate(id);
    }
  };

  // Pagination
  const totalPages = Math.max(1, Math.ceil(applications.length / ITEMS_PER_PAGE));
  const paged = applications.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  return (
    <>
      <Card className="glass border-slate-200/50">
        <CardHeader>
          <CardTitle className="text-slate-900 dark:text-white flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-primary" />
            Job Applications
          </CardTitle>
          <CardDescription>Review and manage all submitted job applications.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filters */}
          <div className="flex flex-wrap gap-3 items-center">
            <Select value={filterStatus} onValueChange={(v) => { setFilterStatus(v); setPage(1); }}>
              <SelectTrigger className="w-44 glass border-slate-200/50">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="reviewing">Reviewing</SelectItem>
                <SelectItem value="shortlisted">Shortlisted</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="hired">Hired</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-sm text-slate-500">{applications.length} application{applications.length !== 1 ? 's' : ''}</span>
          </div>

          {/* Table */}
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
          ) : paged.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <FileText className="w-10 h-10 mx-auto mb-3 opacity-40" />
              <p>No applications found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-slate-200/50">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/50 dark:bg-slate-800/50">
                    <TableHead>Applicant</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Mobile</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead>Resume</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paged.map((app) => (
                    <TableRow key={app.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                      <TableCell className="font-medium">
                        {app.suffix ? `${app.suffix} ` : ''}{app.first_name} {app.last_name}
                      </TableCell>
                      <TableCell className="text-slate-600 dark:text-slate-400">{app.email}</TableCell>
                      <TableCell className="text-slate-600 dark:text-slate-400">{app.mobile}</TableCell>
                      <TableCell>
                        <Badge className={`text-xs border ${STATUS_COLORS[app.status] ?? 'bg-slate-100 text-slate-700'}`}>
                          {app.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-slate-500 text-sm">
                        {format(new Date(app.created_at), 'MMM d, yyyy')}
                      </TableCell>
                      <TableCell>
                        {app.resume_url ? (
                          <a
                            href={app.resume_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline text-sm flex items-center gap-1"
                          >
                            <FileText className="w-3 h-3" /> View
                          </a>
                        ) : (
                          <span className="text-slate-400 text-sm">—</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button size="sm" variant="outline" className="glass border-slate-200/50 h-8 w-8 p-0" onClick={() => openDetail(app)}>
                            <Eye className="w-3.5 h-3.5" />
                          </Button>
                          <Button size="sm" variant="outline" className="glass border-red-200/50 text-red-600 hover:bg-red-50 h-8 w-8 p-0"
                            onClick={() => handleDelete(app.id)}>
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-3 pt-2">
              <Button size="sm" variant="outline" className="glass border-slate-200/50 h-8 w-8 p-0"
                disabled={page === 1} onClick={() => setPage(p => p - 1)}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="text-sm text-slate-600 dark:text-slate-400">
                Page {page} of {totalPages}
              </span>
              <Button size="sm" variant="outline" className="glass border-slate-200/50 h-8 w-8 p-0"
                disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detail / Edit Dialog */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-primary" />
              Application Details
            </DialogTitle>
          </DialogHeader>
          {selectedApp && (
            <div className="space-y-6">
              {/* Identity */}
              <section>
                <h3 className="font-semibold text-sm text-slate-500 uppercase tracking-wide mb-3">Personal Information</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><span className="text-slate-500">Name:</span> <span className="font-medium">{selectedApp.suffix ? `${selectedApp.suffix} ` : ''}{selectedApp.first_name} {selectedApp.last_name}</span></div>
                  <div><span className="text-slate-500">Gender:</span> {selectedApp.gender || '—'}</div>
                  <div><span className="text-slate-500">Email:</span> {selectedApp.email}</div>
                  <div><span className="text-slate-500">Mobile:</span> {selectedApp.mobile}</div>
                  {selectedApp.alternate_mobile && <div><span className="text-slate-500">Alt. Mobile:</span> {selectedApp.alternate_mobile}</div>}
                  <div><span className="text-slate-500">Education:</span> {selectedApp.highest_graduation || '—'}</div>
                  {selectedApp.address && <div className="col-span-2"><span className="text-slate-500">Address:</span> {selectedApp.address}, {selectedApp.city}, {selectedApp.state}, {selectedApp.country}</div>}
                  {selectedApp.languages && selectedApp.languages.length > 0 && (
                    <div><span className="text-slate-500">Languages:</span> {selectedApp.languages.join(', ')}</div>
                  )}
                </div>
              </section>

              {/* Employment */}
              {selectedApp.previous_employment && selectedApp.previous_employment.length > 0 && (
                <section>
                  <h3 className="font-semibold text-sm text-slate-500 uppercase tracking-wide mb-3">Previous Employment</h3>
                  <div className="space-y-2">
                    {selectedApp.previous_employment.map((emp: any, i: number) => (
                      <div key={i} className="text-sm p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                        <p className="font-medium">{emp.jobTitle} at {emp.companyName}</p>
                        <p className="text-slate-500">{emp.startDate} – {emp.endDate || 'Present'} · {emp.country}</p>
                        {emp.reasonForLeaving && <p className="text-slate-500 mt-1">Reason: {emp.reasonForLeaving}</p>}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Certifications */}
              {selectedApp.certifications && selectedApp.certifications.length > 0 && (
                <section>
                  <h3 className="font-semibold text-sm text-slate-500 uppercase tracking-wide mb-3">Certifications</h3>
                  <div className="space-y-2">
                    {selectedApp.certifications.map((cert: any, i: number) => (
                      <div key={i} className="text-sm p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                        <p className="font-medium">{cert.name}</p>
                        <p className="text-slate-500">{cert.issuingOrganization} · {cert.issueDate}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Mobility */}
              <section>
                <h3 className="font-semibold text-sm text-slate-500 uppercase tracking-wide mb-3">Mobility & Preferences</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><span className="text-slate-500">Relocate:</span> {selectedApp.willing_to_relocate || '—'}</div>
                  <div><span className="text-slate-500">Remote:</span> {selectedApp.open_to_remote || '—'}</div>
                  <div><span className="text-slate-500">Travel:</span> {selectedApp.travel_percentage || '—'}</div>
                  {selectedApp.preferred_locations && <div><span className="text-slate-500">Preferred:</span> {selectedApp.preferred_locations}</div>}
                </div>
              </section>

              {/* Job-specific */}
              <section>
                <h3 className="font-semibold text-sm text-slate-500 uppercase tracking-wide mb-3">Job-Specific Information</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><span className="text-slate-500">Expected Salary:</span> {selectedApp.expected_salary || '—'}</div>
                  <div><span className="text-slate-500">Notice Period:</span> {selectedApp.notice_period || '—'}</div>
                  <div><span className="text-slate-500">Referral:</span> {selectedApp.referral || '—'}</div>
                  <div><span className="text-slate-500">How they heard:</span> {selectedApp.how_did_you_hear || '—'}</div>
                </div>
                {selectedApp.cover_letter && (
                  <div className="mt-3"><p className="text-slate-500 text-sm mb-1">Cover Letter:</p>
                    <p className="text-sm p-3 rounded-lg bg-slate-50 dark:bg-slate-800 whitespace-pre-wrap">{selectedApp.cover_letter}</p>
                  </div>
                )}
              </section>

              {/* Resume */}
              {selectedApp.resume_url && (
                <section>
                  <h3 className="font-semibold text-sm text-slate-500 uppercase tracking-wide mb-2">Resume</h3>
                  <a href={selectedApp.resume_url} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-primary hover:underline text-sm">
                    <FileText className="w-4 h-4" /> Download / View Resume
                  </a>
                </section>
              )}

              {/* Status & Notes (editable) */}
              <section className="border-t pt-4 space-y-4">
                <h3 className="font-semibold text-sm text-slate-500 uppercase tracking-wide">Admin Review</h3>
                <div className="space-y-2">
                  <Label htmlFor="app-status">Status</Label>
                  <Select value={editStatus} onValueChange={setEditStatus}>
                    <SelectTrigger id="app-status" className="glass border-slate-200/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="reviewing">Reviewing</SelectItem>
                      <SelectItem value="shortlisted">Shortlisted</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                      <SelectItem value="hired">Hired</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="app-notes">Notes</Label>
                  <Textarea
                    id="app-notes"
                    value={editNotes}
                    onChange={(e) => setEditNotes(e.target.value)}
                    placeholder="Internal notes about this applicant..."
                    rows={3}
                    className="glass border-slate-200/50"
                  />
                </div>
                <div className="flex justify-between gap-3 pt-2">
                  <Button variant="outline" className="glass border-red-200/50 text-red-600 hover:bg-red-50"
                    onClick={() => handleDelete(selectedApp.id)}>
                    <Trash2 className="w-4 h-4 mr-2" /> Delete
                  </Button>
                  <div className="flex gap-3">
                    <Button variant="outline" className="glass border-slate-200/50" onClick={() => setDetailOpen(false)}>
                      Cancel
                    </Button>
                    <Button className="bg-gradient-to-r from-amber-400 to-orange-500 text-white"
                      onClick={handleSave} disabled={updateMutation.isPending}>
                      {updateMutation.isPending ? 'Saving…' : 'Save Changes'}
                    </Button>
                  </div>
                </div>
              </section>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default JobApplicationsManager;
