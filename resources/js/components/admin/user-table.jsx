import React from 'react';
import { PencilIcon, TrashIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';

export function UserTable({ users, onEdit, onDelete }) {
  // Check if users structure is as expected and provide defaults if not
  const hasData = users && Array.isArray(users.data);
  const hasMeta = users && users.meta;
  
  // Safe access to pagination data with fallbacks
  const from = hasMeta && users.meta.from ? users.meta.from : 0;
  const to = hasMeta && users.meta.to ? users.meta.to : 0;
  const total = hasMeta && users.meta.total ? users.meta.total : 0;
  const links = hasMeta && Array.isArray(users.meta.links) ? users.meta.links : [];

  return (
    <div className="rounded-md border">
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {hasData ? (
            users.data.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">{user.role || 'N/A'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(user)}
                      aria-label="Edit user"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(user)}
                      aria-label="Delete user"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                No users found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="px-4 py-3 bg-gray-50 border-t flex items-center justify-between">
        <div className="text-sm text-gray-500">
          Showing {from} to {to} of {total} users
        </div>
        <div className="flex space-x-2">
          {links.map((link, i) => (
            link.url ? (
              <Link
                key={i}
                href={link.url}
                className={`px-3 py-1 rounded text-sm ${
                  link.active
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
                dangerouslySetInnerHTML={{ __html: link.label }}
              />
            ) : (
              <span
                key={i}
                className="px-3 py-1 rounded text-sm text-gray-400 bg-gray-100"
                dangerouslySetInnerHTML={{ __html: link.label }}
              />
            )
          ))}
        </div>
      </div>
    </div>
  );
}
