import React, {useState} from 'react';
import {Head, usePage} from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import {Button} from '@/components/ui/button';
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger
} from '@/components/ui/dialog';
import {UserForm} from '@/components/admin/user-form';
import {UserTable} from '@/components/admin/user-table';
import {DeleteUserDialog} from '@/components/admin/delete-user-dialog';
import {PlusIcon} from 'lucide-react';


const breadcrumbs = [{
    title: 'Dashboard', href: '/dashboard',
}, {
    title: 'Users', href: '/admin/users',
},];

export default function Users({users, flash}) {
    // Fallback for flash messages if not provided directly in props
    const page = usePage().props;
    const flashMessages = flash || page.flash || {};
    const [addModalOpen, setAddModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [userToEdit, setUserToEdit] = useState(null);
    const [userToDelete, setUserToDelete] = useState(null);

    const handleEdit = (user) => {
        setUserToEdit(user);
        setEditModalOpen(true);
    };

    const handleDelete = (user) => {
        setUserToDelete(user);
        setDeleteDialogOpen(true);
    };

    return (<AppLayout breadcrumbs={breadcrumbs}>
        <Head title="Users"/>

        <div className="p-4 space-y-4">
            {/* Flash Messages */}
            {flashMessages?.message && (
                <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4" role="alert">
                    <p>{flashMessages.message}</p>
                </div>)}

            {flashMessages?.error && (<div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
                <p>{flashMessages.error}</p>
            </div>)}

            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Users</h1>

                <Dialog open={addModalOpen} onOpenChange={setAddModalOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <PlusIcon className="h-4 w-4 mr-2"/>
                            Add User
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add New User</DialogTitle>
                        </DialogHeader>
                        <UserForm
                            onSuccess={() => setAddModalOpen(false)}
                            mode="create"
                        />
                    </DialogContent>
                </Dialog>
            </div>

            <UserTable
                users={users}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            {userToEdit && (<Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit User</DialogTitle>
                    </DialogHeader>
                    <UserForm
                        user={userToEdit}
                        onSuccess={() => setEditModalOpen(false)}
                        mode="edit"
                    />
                </DialogContent>
            </Dialog>)}

            {userToDelete && (<DeleteUserDialog
                user={userToDelete}
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
            />)}
        </div>
    </AppLayout>);
}
