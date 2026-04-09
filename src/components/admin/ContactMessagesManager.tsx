/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Trash2, Eye, Mail, CheckCheck, MessageSquare } from 'lucide-react';
import { api } from '@/lib/api';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

interface ContactMessage {
  id: string;
  full_name: string;
  contact_number?: string;
  email: string;
  message: string;
  is_read: boolean;
  submitted_at: string;
}

const ContactMessagesManager = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

  const { data: messages = [], isLoading } = useQuery<ContactMessage[]>({
    queryKey: ['contact-messages'],
    queryFn: async () => {
      const res = await api.get<ContactMessage[]>('/contact_messages');
      if (res.error) throw new Error(String(res.error));
      return (res.data ?? []) as ContactMessage[];
    },
  });

  const toggleReadMutation = useMutation({
    mutationFn: (id: string) => api.patch(`/contact_messages/${id}/read`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contact-messages'] });
    },
    onError: () => {
      toast({ title: 'Failed to update', variant: 'destructive' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/contact_messages/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contact-messages'] });
      setSelectedMessage(null);
      toast({ title: 'Message deleted' });
    },
    onError: () => {
      toast({ title: 'Failed to delete', variant: 'destructive' });
    },
  });

  const unreadCount = messages.filter(m => !m.is_read).length;

  return (
    <div className="space-y-6">
      <Card className="glass border-slate-200/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-primary" />
                Contact Messages
                {unreadCount > 0 && (
                  <Badge variant="destructive" className="ml-2">{unreadCount} unread</Badge>
                )}
              </CardTitle>
              <CardDescription>Messages submitted via the Message Us form</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-12 text-muted-foreground">Loading messages…</div>
          ) : messages.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Mail className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p>No messages yet.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Status</TableHead>
                  <TableHead>Full Name</TableHead>
                  <TableHead>Contact Number</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Date &amp; Time</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {messages.map((msg) => (
                  <TableRow key={msg.id} className={!msg.is_read ? 'bg-primary/5 font-medium' : ''}>
                    <TableCell>
                      <Badge variant={msg.is_read ? 'secondary' : 'default'}>
                        {msg.is_read ? 'Read' : 'Unread'}
                      </Badge>
                    </TableCell>
                    <TableCell>{msg.full_name}</TableCell>
                    <TableCell>{msg.contact_number || '—'}</TableCell>
                    <TableCell className="max-w-[160px] truncate">{msg.email}</TableCell>
                    <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                      {format(new Date(msg.submitted_at), 'MMM d, yyyy h:mm a')}
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate text-muted-foreground">
                      {msg.message}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedMessage(msg)}
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => toggleReadMutation.mutate(msg.id)}
                          title={msg.is_read ? 'Mark as unread' : 'Mark as read'}
                        >
                          <CheckCheck className={`w-3.5 h-3.5 ${msg.is_read ? 'text-muted-foreground' : 'text-primary'}`} />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-destructive hover:text-destructive"
                          onClick={() => deleteMutation.mutate(msg.id)}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* View Message Dialog */}
      <Dialog open={!!selectedMessage} onOpenChange={(open) => !open && setSelectedMessage(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Message from {selectedMessage?.full_name}</DialogTitle>
          </DialogHeader>
          {selectedMessage && (
            <div className="space-y-4 text-sm">
              <dl className="grid grid-cols-[120px_1fr] gap-y-2">
                <dt className="text-muted-foreground font-medium">Full Name</dt>
                <dd>{selectedMessage.full_name}</dd>
                <dt className="text-muted-foreground font-medium">Contact Number</dt>
                <dd>{selectedMessage.contact_number || '—'}</dd>
                <dt className="text-muted-foreground font-medium">Email</dt>
                <dd>
                  <a href={`mailto:${selectedMessage.email}`} className="text-primary underline underline-offset-2">
                    {selectedMessage.email}
                  </a>
                </dd>
                <dt className="text-muted-foreground font-medium">Date &amp; Time</dt>
                <dd>{format(new Date(selectedMessage.submitted_at), 'MMMM d, yyyy — h:mm a')}</dd>
              </dl>
              <div>
                <p className="text-muted-foreground font-medium mb-2">Message</p>
                <p className="bg-muted/50 rounded-lg p-3 whitespace-pre-wrap leading-relaxed">
                  {selectedMessage.message}
                </p>
              </div>
              <div className="flex justify-between pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    toggleReadMutation.mutate(selectedMessage.id);
                    setSelectedMessage(prev => prev ? { ...prev, is_read: !prev.is_read } : null);
                  }}
                >
                  <CheckCheck className="w-4 h-4 mr-1.5" />
                  {selectedMessage.is_read ? 'Mark as Unread' : 'Mark as Read'}
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => deleteMutation.mutate(selectedMessage.id)}
                >
                  <Trash2 className="w-4 h-4 mr-1.5" />
                  Delete
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ContactMessagesManager;
