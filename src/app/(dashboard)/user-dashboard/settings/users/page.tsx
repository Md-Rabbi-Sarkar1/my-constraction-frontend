"use client";

import React, { useState } from 'react';
import { InviteUserForm } from '@/components/form/InviteUserForm';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { useGetAllUsers, useGetMe } from '@/hooks';
import { UserItem } from '@/api';

export default function UsersPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: currentUser, isLoading: isMeLoading, isError: isMeError } = useGetMe();
  const { data: allUsers = [], isLoading: isAllLoading, isError: isAllError } = useGetAllUsers();

  const isLoading = isMeLoading || isAllLoading;
  const isError = isMeError || isAllError;

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

      {!isLoading && !isError && (
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
              {/* 1. Administrator Current Identity */}
              {currentUser?.data && (
                <tr className="hover:bg-slate-50 bg-slate-50/50">
                  <td className="px-6 py-4 font-medium text-slate-900">
                    {currentUser.data.name || "N/A"}
                    <span className="ml-2 text-xs font-normal text-muted-foreground bg-slate-200 px-1.5 py-0.5 rounded">You</span>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{currentUser.data.email}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 text-xs font-semibold rounded-md bg-blue-50 text-blue-700 uppercase">
                      {currentUser.data.role || "MEMBER"}
                    </span>
                  </td>
                </tr>
              )}

              {/* 2. Co-workers directory loop */}
              {Array.isArray(allUsers) && allUsers
                // Filter out yourself using the email from your active profile token context
                .filter((member: UserItem) => member.email !== currentUser?.data?.email)
                .map((member: UserItem) => (
                  <tr key={member.email} className="hover:bg-slate-50">
                    <td className="px-6 py-4 font-medium text-slate-900">
                      {member.name || (
                        <span className="text-amber-600 italic font-normal">Pending Invite...</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-slate-600">{member.email}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 text-xs font-semibold rounded-md bg-slate-100 text-slate-700 uppercase">
                        {member.role?.replace(/_/g, " ")}
                      </span>
                    </td>
                  </tr>
                ))}

              {/* 3. Empty Fallback State */}
              {allUsers.length === 0 && !currentUser?.data && (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center text-muted-foreground">
                    No team members found.
                  </td>
                </tr>
              )}
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
            <Button type="submit" form="invite-user-form">
              Send Invitation
            </Button>
          </>
        }
      >
        <InviteUserForm onSuccess={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  );
}
