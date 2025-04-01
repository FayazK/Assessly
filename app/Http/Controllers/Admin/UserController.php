<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class UserController extends Controller
{
    /**
     * Display a listing of the users.
     */
    public function index()
    {
        $users = User::query()
            ->latest()
            ->paginate(10)
            ->withQueryString();
        
        // Ensure the pagination data is properly formatted for the frontend
        return Inertia::render('admin/users', [
            'users' => $users,
            // Make sure flash messages are passed to the frontend
            'flash' => [
                'message' => session('message'),
                'error' => session('error'),
            ],
        ]);
    }
    
    /**
     * Store a newly created user in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'string', 'min:8'],
            'role' => ['required', 'string', Rule::in(['admin', 'candidate'])],
        ]);
        
        // Hash the password
        $validated['password'] = Hash::make($validated['password']);
        
        // Create the user
        User::create($validated);
        
        // Redirect back with success message
        return redirect()->route('admin.users.index')->with('message', 'User created successfully.');
    }
    
    /**
     * Update the specified user in storage.
     */
    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
            'role' => ['required', 'string', Rule::in(['admin', 'candidate'])],
        ]);
        
        // Update password if provided
        if ($request->filled('password')) {
            $request->validate([
                'password' => ['string', 'min:8'],
            ]);
            
            $validated['password'] = Hash::make($request->password);
        }
        
        // Update the user
        $user->update($validated);
        
        // Redirect back with success message
        return redirect()->route('admin.users.index')->with('message', 'User updated successfully.');
    }
    
    /**
     * Remove the specified user from storage.
     */
    public function destroy(User $user)
    {
        // Make sure we're not deleting ourselves
        if (auth()->id() === $user->id) {
            return redirect()->route('admin.users.index')->with('error', 'You cannot delete your own account.');
        }
        
        // Delete the user
        $user->delete();
        
        // Redirect back with success message
        return redirect()->route('admin.users.index')->with('message', 'User deleted successfully.');
    }
}
