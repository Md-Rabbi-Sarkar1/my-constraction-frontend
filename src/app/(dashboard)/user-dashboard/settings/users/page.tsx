"use client";

import React, { useState } from 'react';
import { InviteUserForm } from '@/components/form/InviteUserForm'; 
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { useGetMe } from '@/hooks';

export default function UsersPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: user, isLoading, isError } = useGetMe();

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-950">Team Members</h1>
          <p className="text-sm text-muted-foreground">Manage users and invite new members.</p>
        </div>
        
        <Button onClick={() => setIsModalOpen(true)}>Invite Member</Button>
      </div>

      {isLoading && <div className="rounded-md border p-8 text-center text-muted-foreground animate-pulse">Loading...</div>}
      {isError && <div className="rounded-md border border-red-200 p-8 text-center text-red-600 bg-red-50">Error loading page.</div>}

      {!isLoading && !isError && user?.data && (
        <div className="rounded-md border bg-white overflow-hidden shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-6 py-3 font-medium">Name</th>
                <th className="px-6 py-3 font-medium">Email</th>
                <th className="px-6 py-3 font-medium">Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr className="hover:bg-slate-50">
                <td className="px-6 py-4 font-medium text-slate-900">
                  {user.data.name || "N/A"}
                  <span className="ml-2 text-xs font-normal text-muted-foreground bg-slate-100 px-1.5 py-0.5 rounded">You</span>
                </td>
                <td className="px-6 py-4 text-slate-600">{user.data.email}</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 text-xs font-semibold rounded-md bg-blue-50 text-blue-700 uppercase">
                    {user.data.role || "MEMBER"}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Invite Team Member"
        description="Provide the user details below to issue a secure dashboard invitation link."
        footer={
          <>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            {/* The form submit button still works perfectly because it targets the form ID */}
            <Button type="submit" form="invite-user-form">
              Send Invitation
            </Button>
          </>
        }
      >
        {/* Look how clean this is. No handlers passed from the parent! */}
        <InviteUserForm onSuccess={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  );
}
