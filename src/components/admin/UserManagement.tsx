/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRoles, UserRole } from '@/hooks/useRoles';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
    Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
    Crown, UserCheck, Plus, Trash2, Edit, Search, Users, ShieldCheck, ShieldOff,
} from 'lucide-react';

// ─── Types ──────────────────────────────────────────────────────────────────

interface UserRow {
    id: string;
    email: string;
    full_name?: string;
    avatar_url?: string;
    role?: UserRole;
    created_at?: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const ROLES: { value: UserRole; label: string; icon: React.ReactNode }[] = [
    { value: 'user', label: 'User', icon: <UserCheck className="w-3.5 h-3.5" /> },
    { value: 'admin', label: 'Admin', icon: <Crown className="w-3.5 h-3.5" /> },
];

const roleBadge = (role: UserRole) =>
    role === 'admin'
        ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 border-orange-200 dark:border-orange-800'
        : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700';

const fmtDate = (iso?: string) =>
    iso ? new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '—';

// ─── Sub-component: Add User Dialog ──────────────────────────────────────────

interface AddUserDialogProps {
    open: boolean;
    onOpenChange: (v: boolean) => void;
    onSuccess: () => void;
}

const AddUserDialog = ({ open, onOpenChange, onSuccess }: AddUserDialogProps) => {
    const { toast } = useToast();
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState<UserRole>('user');

    const mutation = useMutation({
        mutationFn: () =>
            api.post('/admin/users', { email, password, full_name: fullName, role }),
        onSuccess: (res) => {
            if (res.error) throw res.error;
            toast({ title: 'User created', description: `${fullName || email} has been added.` });
            setFullName(''); setEmail(''); setPassword(''); setRole('user');
            onOpenChange(false);
            onSuccess();
        },
        onError: (err: any) => {
            toast({ title: 'Error', description: err?.message || 'Failed to create user', variant: 'destructive' });
        },
    });

    const handleSubmit = () => {
        if (!email || !password || !fullName) {
            toast({ title: 'Validation', description: 'All fields are required.', variant: 'destructive' });
            return;
        }
        mutation.mutate();
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Users className="w-5 h-5 text-primary" />
                        Add New User
                    </DialogTitle>
                    <DialogDescription>
                        Create a new system user and assign their role.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="new-fullname">Full Name</Label>
                        <Input
                            id="new-fullname"
                            value={fullName}
                            onChange={e => setFullName(e.target.value)}
                            placeholder="Juan dela Cruz"
                            autoComplete="off"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="new-email">Email</Label>
                        <Input
                            id="new-email"
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            placeholder="juan@example.com"
                            autoComplete="off"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="new-password">Password</Label>
                        <Input
                            id="new-password"
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            placeholder="Minimum 8 characters"
                            autoComplete="new-password"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="new-role">Role</Label>
                        <Select value={role} onValueChange={v => setRole(v as UserRole)}>
                            <SelectTrigger id="new-role">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {ROLES.map(r => (
                                    <SelectItem key={r.value} value={r.value}>
                                        <span className="flex items-center gap-2">{r.icon} {r.label}</span>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground">
                            {role === 'admin'
                                ? '⚠️ Admins have full CMS access.'
                                : 'Standard users have read-only access.'}
                        </p>
                    </div>
                </div>

                <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={mutation.isPending}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={mutation.isPending}
                        className="bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white"
                    >
                        {mutation.isPending ? 'Creating…' : 'Create User'}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

// ─── Sub-component: Edit User Dialog ─────────────────────────────────────────

interface EditUserDialogProps {
    user: UserRow | null;
    open: boolean;
    onOpenChange: (v: boolean) => void;
    onSuccess: () => void;
}

const EditUserDialog = ({ user, open, onOpenChange, onSuccess }: EditUserDialogProps) => {
    const { toast } = useToast();
    const [fullName, setFullName] = useState(user?.full_name ?? '');
    const [role, setRole] = useState<UserRole>((user?.role as UserRole) ?? 'user');

    // Sync form when the target user changes
    const resetForm = (u?: UserRow | null) => {
        setFullName(u?.full_name ?? '');
        setRole((u?.role as UserRole) ?? 'user');
    };

    const mutation = useMutation({
        mutationFn: () =>
            api.put(`/admin/users/${user?.id}`, { full_name: fullName, role }),
        onSuccess: (res) => {
            if (res.error) throw res.error;
            toast({ title: 'User updated', description: 'Changes saved successfully.' });
            onOpenChange(false);
            onSuccess();
        },
        onError: (err: any) => {
            toast({ title: 'Error', description: err?.message || 'Failed to update user', variant: 'destructive' });
        },
    });

    return (
        <Dialog open={open} onOpenChange={v => { onOpenChange(v); if (!v) resetForm(user); }}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Edit className="w-5 h-5 text-primary" />
                        Edit User
                    </DialogTitle>
                    <DialogDescription>
                        Update <span className="font-medium">{user?.email}</span>
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="edit-fullname">Full Name</Label>
                        <Input
                            id="edit-fullname"
                            value={fullName}
                            onChange={e => setFullName(e.target.value)}
                            placeholder="Full name"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="edit-role">Role</Label>
                        <Select value={role} onValueChange={v => setRole(v as UserRole)}>
                            <SelectTrigger id="edit-role">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {ROLES.map(r => (
                                    <SelectItem key={r.value} value={r.value}>
                                        <span className="flex items-center gap-2">{r.icon} {r.label}</span>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={mutation.isPending}>
                        Cancel
                    </Button>
                    <Button
                        onClick={() => mutation.mutate()}
                        disabled={mutation.isPending}
                        className="bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white"
                    >
                        {mutation.isPending ? 'Saving…' : 'Save Changes'}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

// ─── Main Component ───────────────────────────────────────────────────────────

const UserManagement = () => {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const { user: currentUser } = useAuth();
    const { getAllUsersWithRoles, updateUserRole } = useRoles();

    // Dialog state
    const [addOpen, setAddOpen] = useState(false);
    const [editUser, setEditUser] = useState<UserRow | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<UserRow | null>(null);
    const [search, setSearch] = useState('');

    // ── Data ──
    const { data: users = [], isLoading, refetch } = useQuery<UserRow[]>({
        queryKey: ['admin', 'users'],
        queryFn: getAllUsersWithRoles as () => Promise<UserRow[]>,
        staleTime: 2 * 60 * 1000,
        refetchOnWindowFocus: false,
    });

    // ── Filtered list ──
    const filtered = useMemo(() => {
        const q = search.toLowerCase();
        if (!q) return users;
        return users.filter(u =>
            u.email.toLowerCase().includes(q) ||
            (u.full_name ?? '').toLowerCase().includes(q)
        );
    }, [users, search]);

    // ── Inline role change ──
    const handleRoleChange = async (userId: string, newRole: UserRole) => {
        try {
            await updateUserRole(userId, newRole);
            queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
        } catch (err: any) {
            toast({ title: 'Error', description: err?.message || 'Role update failed', variant: 'destructive' });
        }
    };

    // ── Delete ──
    const deleteMutation = useMutation({
        mutationFn: (userId: string) => api.delete(`/admin/users/${userId}`),
        onSuccess: (res) => {
            if (res.error) throw res.error;
            toast({ title: 'User deleted', description: `${deleteTarget?.full_name || deleteTarget?.email} removed.` });
            setDeleteTarget(null);
            refetch();
        },
        onError: (err: any) => {
            toast({ title: 'Error', description: err?.message || 'Failed to delete user', variant: 'destructive' });
            setDeleteTarget(null);
        },
    });

    // ── Role counts ──
    const adminCount = users.filter(u => u.role === 'admin').length;
    const userCount = users.filter(u => u.role !== 'admin').length;

    return (
        <>
            {/* Stats row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                {[
                    { label: 'Total Users', value: users.length, icon: Users, color: 'from-amber-400 to-orange-500' },
                    { label: 'Admins', value: adminCount, icon: ShieldCheck, color: 'from-red-400 to-orange-500' },
                    { label: 'Standard Users', value: userCount, icon: ShieldOff, color: 'from-teal-500 to-cyan-500' },
                ].map(s => (
                    <Card key={s.label} className="glass border-slate-200/50">
                        <CardContent className="p-5 flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">{s.label}</p>
                                <p className="text-3xl font-bold text-slate-900 dark:text-white">{s.value}</p>
                            </div>
                            <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center`}>
                                <s.icon className="w-5 h-5 text-white" />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Main table card */}
            <Card className="glass border-slate-200/50">
                <CardHeader>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <CardTitle className="text-slate-900 dark:text-white">User Management</CardTitle>
                            <CardDescription>
                                Manage accounts and permissions for your JDGK Business Solutions system.
                            </CardDescription>
                        </div>
                        <Button
                            onClick={() => setAddOpen(true)}
                            className="bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white shrink-0"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Add User
                        </Button>
                    </div>

                    {/* Search */}
                    <div className="relative mt-2">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                        <Input
                            className="pl-9"
                            placeholder="Search by name or email…"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                </CardHeader>

                <CardContent>
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-16 gap-3">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                            <p className="text-sm text-muted-foreground">Loading users…</p>
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 gap-3 text-muted-foreground">
                            <Users className="w-10 h-10 opacity-30" />
                            <p className="text-sm">{search ? 'No users match your search.' : 'No users found.'}</p>
                        </div>
                    ) : (
                        <div className="rounded-lg border border-slate-200/50 dark:border-slate-700/50 overflow-hidden">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-slate-50/80 dark:bg-slate-800/50">
                                        <TableHead className="font-semibold">User</TableHead>
                                        <TableHead className="font-semibold">Email</TableHead>
                                        <TableHead className="font-semibold">Role</TableHead>
                                        <TableHead className="font-semibold">Joined</TableHead>
                                        <TableHead className="font-semibold text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filtered.map(user => {
                                        const isSelf = String(currentUser?.id) === String(user.id);
                                        const role = (user.role ?? 'user') as UserRole;
                                        return (
                                            <TableRow key={user.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                                {/* Name + avatar */}
                                                <TableCell>
                                                    <div className="flex items-center gap-3">
                                                        {user.avatar_url ? (
                                                            <img
                                                                src={user.avatar_url}
                                                                alt={user.full_name || user.email}
                                                                className="w-9 h-9 rounded-full object-cover shrink-0 ring-2 ring-slate-200 dark:ring-slate-700"
                                                                onError={(e) => {
                                                                    (e.target as HTMLImageElement).style.display = 'none';
                                                                    (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                                                                }}
                                                            />
                                                        ) : null}
                                                        <div className={`w-9 h-9 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-semibold text-sm shrink-0 ${user.avatar_url ? 'hidden' : ''}`}>
                                                            {(user.full_name || user.email).charAt(0).toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-slate-900 dark:text-white leading-none">
                                                                {user.full_name || <span className="italic text-muted-foreground">No name</span>}
                                                            </p>
                                                            {isSelf && (
                                                                <span className="text-xs text-primary font-medium">You</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </TableCell>

                                                {/* Email */}
                                                <TableCell className="text-slate-600 dark:text-slate-400 text-sm">
                                                    {user.email}
                                                </TableCell>

                                                {/* Role badge + inline selector */}
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <Badge
                                                            className={`flex items-center gap-1 border text-xs font-medium ${roleBadge(role)}`}
                                                            variant="outline"
                                                        >
                                                            {role === 'admin'
                                                                ? <Crown className="w-3 h-3" />
                                                                : <UserCheck className="w-3 h-3" />}
                                                            <span className="capitalize">{role}</span>
                                                        </Badge>
                                                        {!isSelf && (
                                                            <Select
                                                                value={role}
                                                                onValueChange={(v: UserRole) => handleRoleChange(user.id, v)}
                                                            >
                                                                <SelectTrigger className="h-7 w-24 text-xs border-dashed">
                                                                    <SelectValue />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    {ROLES.map(r => (
                                                                        <SelectItem key={r.value} value={r.value} className="text-xs">
                                                                            {r.label}
                                                                        </SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                        )}
                                                    </div>
                                                </TableCell>

                                                {/* Joined date */}
                                                <TableCell className="text-slate-500 dark:text-slate-400 text-sm">
                                                    {fmtDate(user.created_at)}
                                                </TableCell>

                                                {/* Actions */}
                                                <TableCell className="text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="h-8 w-8 p-0 hover:bg-slate-100 dark:hover:bg-slate-700"
                                                            onClick={() => setEditUser(user)}
                                                            title="Edit user"
                                                        >
                                                            <Edit className="w-4 h-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="h-8 w-8 p-0 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 disabled:opacity-30"
                                                            onClick={() => setDeleteTarget(user)}
                                                            disabled={isSelf}
                                                            title={isSelf ? "You cannot delete your own account" : "Delete user"}
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </div>
                    )}

                    {/* Footer count */}
                    {!isLoading && filtered.length > 0 && (
                        <p className="text-xs text-muted-foreground mt-3 text-right">
                            Showing {filtered.length} of {users.length} user{users.length !== 1 ? 's' : ''}
                        </p>
                    )}
                </CardContent>
            </Card>

            {/* ── Dialogs ── */}
            <AddUserDialog
                open={addOpen}
                onOpenChange={setAddOpen}
                onSuccess={refetch}
            />

            <EditUserDialog
                user={editUser}
                open={editUser !== null}
                onOpenChange={open => { if (!open) setEditUser(null); }}
                onSuccess={() => { setEditUser(null); refetch(); }}
            />

            {/* Delete confirmation */}
            <AlertDialog open={deleteTarget !== null} onOpenChange={open => { if (!open) setDeleteTarget(null); }}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete user?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently remove{' '}
                            <span className="font-semibold">{deleteTarget?.full_name || deleteTarget?.email}</span>.
                            This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            className="bg-red-500 hover:bg-red-600 text-white"
                            onClick={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
                            disabled={deleteMutation.isPending}
                        >
                            {deleteMutation.isPending ? 'Deleting…' : 'Delete'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};

export default UserManagement;
