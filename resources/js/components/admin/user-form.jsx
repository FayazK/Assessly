import React, {useEffect} from 'react';
import {useForm} from '@inertiajs/react';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';
import {DialogFooter} from '@/components/ui/dialog';


export function UserForm({user = null, onSuccess, mode = 'create'}) {
    const {data, setData, post, patch, processing, errors, reset} = useForm({
        name: '', email: '', password: '', role: 'candidate',
    });

    useEffect(() => {
        if (user) {
            setData({
                name: user.name, email: user.email, password: '', role: user.role,
            });
        }
    }, [user]);

    const handleSubmit = () => {
        e.preventDefault();

        if (mode === 'create') {
            post(route('admin.users.store'), {
                onSuccess: () => {
                    reset();
                    if (onSuccess) onSuccess();
                },
            });
        } else if (user) {
            patch(route('admin.users.update', user.id), {
                onSuccess: () => {
                    if (onSuccess) onSuccess();
                },
            });
        }
    };

    return (<form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                        Name
                    </Label>
                    <div className="col-span-3">
                        <Input
                            id="name"
                            value={data.name}
                            onChange={e => setData('name', e.target.value)}
                            placeholder="John Doe"
                        />
                        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                    </div>
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="email" className="text-right">
                        Email
                    </Label>
                    <div className="col-span-3">
                        <Input
                            id="email"
                            type="email"
                            value={data.email}
                            onChange={e => setData('email', e.target.value)}
                            placeholder="john@example.com"
                        />
                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    </div>
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="password" className="text-right">
                        Password
                    </Label>
                    <div className="col-span-3">
                        <Input
                            id="password"
                            type="password"
                            value={data.password}
                            onChange={e => setData('password', e.target.value)}
                            placeholder={mode === 'edit' ? 'Leave blank to keep current password' : ''}
                        />
                        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                    </div>
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="role" className="text-right">
                        Role
                    </Label>
                    <div className="col-span-3">
                        <Select
                            value={data.role}
                            onValueChange={(value) => setData('role', value)}
                        >
                            <SelectTrigger id="role">
                                <SelectValue placeholder="Select a role"/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="admin">Admin</SelectItem>
                                <SelectItem value="candidate">Candidate</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.role && <p className="text-red-500 text-sm mt-1">{errors.role}</p>}
                    </div>
                </div>
            </div>

            <DialogFooter>
                <Button type="submit" disabled={processing}>
                    {mode === 'create' ? 'Create' : 'Update'} User
                </Button>
            </DialogFooter>
        </form>);
}
