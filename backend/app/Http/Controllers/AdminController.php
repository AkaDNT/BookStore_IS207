<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Illuminate\Validation\Rule;
use Illuminate\Database\QueryException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use App\Models\User;
use App\Models\Role;
use Exception;

class AdminController extends Controller
{
    public function getAllUsers(Request $request)
    {
        try {
            $current = auth('api')->user();
            if (!$this->currentUserIsAdmin($current->id)) {
                return $this->errorResponse(403, 'Access denied', ['auth' => ['Admin role required.']]);
            }

            $users = User::with('roles')->orderBy('id', 'asc')->get();
            return response()->json($users->map(fn($u) => $this->userResponse($u))->values());
        } catch (QueryException $e) {
            return $this->errorResponse(500, 'Database error', ['database' => [$e->getMessage()]]);
        } catch (Exception $e) {
            return $this->errorResponse(500, 'Server error', ['server' => [$e->getMessage()]]);
        }
    }

    public function getAllCustomers(Request $request)
    {
        try {
            $current = auth('api')->user();
            if (!$this->currentUserIsAdmin($current->id)) {
                return $this->errorResponse(403, 'Access denied', ['auth' => ['Admin role required.']]);
            }

            $users = User::whereHas('roles', function ($q) {
                $q->whereIn(DB::raw('UPPER(name)'), ['ROLE_USER', 'USER']);
            })->with('roles')->orderBy('id', 'asc')->get();

            return response()->json($users->map(fn($u) => $this->userResponse($u))->values());
        } catch (QueryException $e) {
            return $this->errorResponse(500, 'Database error', ['database' => [$e->getMessage()]]);
        } catch (Exception $e) {
            return $this->errorResponse(500, 'Server error', ['server' => [$e->getMessage()]]);
        }
    }

    public function getAllEmployees(Request $request)
    {
        try {
            $current = auth('api')->user();
            if (!$this->currentUserIsAdmin($current->id)) {
                return $this->errorResponse(403, 'Access denied', ['auth' => ['Admin role required.']]);
            }

            $users = User::whereHas('roles', function ($q) {
                $q->whereIn(DB::raw('UPPER(name)'), ['ROLE_EMPLOYEE', 'EMPLOYEE', 'ROLE_EMPLOYEES', 'EMPLOYEES']);
            })->with('roles')->orderBy('id', 'asc')->get();

            return response()->json($users->map(fn($u) => $this->userResponse($u))->values());
        } catch (QueryException $e) {
            return $this->errorResponse(500, 'Database error', ['database' => [$e->getMessage()]]);
        } catch (Exception $e) {
            return $this->errorResponse(500, 'Server error', ['server' => [$e->getMessage()]]);
        }
    }

    public function searchUsers(Request $request)
    {
        try {
            $current = auth('api')->user();
            if (!$this->currentUserIsAdmin($current->id)) {
                return $this->errorResponse(403, 'Access denied', ['auth' => ['Admin role required.']]);
            }

            $term = (string) $request->query('searchTerm', '');
            $users = User::with('roles')
                ->when($term !== '', function ($q) use ($term) {
                    $q->whereRaw('LOWER(user_name) LIKE ?', ['%' . mb_strtolower($term, 'UTF-8') . '%']);
                })
                ->orderBy('id', 'asc')
                ->get();

            return response()->json($users->map(fn($u) => $this->userResponse($u))->values());
        } catch (QueryException $e) {
            return $this->errorResponse(500, 'Database error', ['database' => [$e->getMessage()]]);
        } catch (Exception $e) {
            return $this->errorResponse(500, 'Server error', ['server' => [$e->getMessage()]]);
        }
    }

    public function searchCustomers(Request $request)
    {
        try {
            $current = auth('api')->user();
            if (!$this->currentUserIsAdmin($current->id)) {
                return $this->errorResponse(403, 'Access denied', ['auth' => ['Admin role required.']]);
            }

            $term = (string) $request->query('searchTerm', '');
            $users = User::with('roles')
                ->whereHas('roles', function ($q) {
                    $q->whereIn(DB::raw('UPPER(name)'), ['ROLE_USER', 'USER']);
                })
                ->when($term !== '', function ($q) use ($term) {
                    $q->whereRaw('LOWER(user_name) LIKE ?', ['%' . mb_strtolower($term, 'UTF-8') . '%']);
                })
                ->orderBy('id', 'asc')
                ->get();

            return response()->json($users->map(fn($u) => $this->userResponse($u))->values());
        } catch (QueryException $e) {
            return $this->errorResponse(500, 'Database error', ['database' => [$e->getMessage()]]);
        } catch (Exception $e) {
            return $this->errorResponse(500, 'Server error', ['server' => [$e->getMessage()]]);
        }
    }

    public function searchEmployees(Request $request)
    {
        try {
            $current = auth('api')->user();
            if (!$this->currentUserIsAdmin($current->id)) {
                return $this->errorResponse(403, 'Access denied', ['auth' => ['Admin role required.']]);
            }

            $term = (string) $request->query('searchTerm', '');
            $users = User::with('roles')
                ->whereHas('roles', function ($q) {
                    $q->whereIn(DB::raw('UPPER(name)'), ['ROLE_EMPLOYEE', 'EMPLOYEE', 'ROLE_EMPLOYEES', 'EMPLOYEES']);
                })
                ->when($term !== '', function ($q) use ($term) {
                    $q->whereRaw('LOWER(user_name) LIKE ?', ['%' . mb_strtolower($term, 'UTF-8') . '%']);
                })
                ->orderBy('id', 'asc')
                ->get();

            return response()->json($users->map(fn($u) => $this->userResponse($u))->values());
        } catch (QueryException $e) {
            return $this->errorResponse(500, 'Database error', ['database' => [$e->getMessage()]]);
        } catch (Exception $e) {
            return $this->errorResponse(500, 'Server error', ['server' => [$e->getMessage()]]);
        }
    }

    public function updateUser(Request $request)
    {
        try {
            $data = $request->validate([
                'updatedUserId' => ['required','integer','min:1'],
                'userName'      => ['sometimes','string','min:2','max:20', Rule::unique('users','user_name')->ignore($request->input('updatedUserId'))],
                'email'         => ['sometimes','email','max:50', Rule::unique('users','email')->ignore($request->input('updatedUserId'))],
                'roles'         => ['sometimes','array'],
                'roles.*'       => ['string','min:2','max:50'],
            ]);

            $current = auth('api')->user();
            if (!$this->currentUserIsAdmin($current->id)) {
                return $this->errorResponse(403, 'Access denied', ['auth' => ['Admin role required.']]);
            }

            $user = User::with('roles')->findOrFail((int)$data['updatedUserId']);

            if (array_key_exists('userName', $data)) $user->user_name = mb_strtolower(trim($data['userName']), 'UTF-8');
            if (array_key_exists('email', $data)) $user->email = mb_strtolower(trim($data['email']), 'UTF-8');

            DB::transaction(function () use ($user, $data) {
                $user->save();

                if (isset($data['roles'])) {
                    $roleIds = collect($data['roles'])->map(function ($r) {
                        $name = mb_strtoupper(trim($r), 'UTF-8');
                        $aliases = [
                            'ADMIN' => 'ROLE_ADMIN',
                            'EMPLOYEE' => 'ROLE_EMPLOYEE',
                            'EMPLOYEES' => 'ROLE_EMPLOYEE',
                            'USER' => 'ROLE_USER',
                        ];
                        if (isset($aliases[$name])) $name = $aliases[$name];
                        $role = Role::firstOrCreate(['name' => $name]);
                        return $role->id;
                    })->filter()->unique()->values()->all();

                    $user->roles()->sync($roleIds);
                }
            });

            return response()->json($this->userResponse(User::with('roles')->find($user->id)));
        } catch (ValidationException $e) {
            return $this->errorResponse(422, 'Validation failed', $e->errors());
        } catch (ModelNotFoundException $e) {
            return $this->errorResponse(404, 'User not found', ['user' => ['User not found.']]);
        } catch (QueryException $e) {
            return $this->errorResponse(500, 'Database error', ['database' => [$e->getMessage()]]);
        } catch (Exception $e) {
            return $this->errorResponse(500, 'Server error', ['server' => [$e->getMessage()]]);
        }
    }

    public function deleteUser(int $id)
    {
        try {
            $current = auth('api')->user();
            if (!$this->currentUserIsAdmin($current->id)) {
                return $this->errorResponse(403, 'Access denied', ['auth' => ['Admin role required.']]);
            }

            $user = User::find($id);
            if (!$user) {
                return $this->errorResponse(404, 'User not found', ['user' => ['User not found.']]);
            }

            $user->delete();
            return response()->json(['message' => 'User deleted successfully'], 204);
        } catch (QueryException $e) {
            return $this->errorResponse(500, 'Database error', ['database' => [$e->getMessage()]]);
        } catch (Exception $e) {
            return $this->errorResponse(500, 'Server error', ['server' => [$e->getMessage()]]);
        }
    }

    private function currentUserIsAdmin(int $userId): bool
    {
        $roles = DB::table('roles')
            ->join('role_user', 'roles.id', '=', 'role_user.role_id')
            ->where('role_user.user_id', $userId)
            ->pluck('roles.name')
            ->map(fn ($r) => mb_strtoupper(trim($r), 'UTF-8'))
            ->toArray();

        return in_array('ADMIN', $roles, true)
            || in_array('ROLE_ADMIN', $roles, true);
    }

    private function userResponse(User $u): array
    {
        return [
            'id'       => $u->id,
            'userName' => $u->user_name,
            'email'    => $u->email,
            'roles'    => $u->roles?->pluck('name')->values()->all() ?? [],
        ];
    }

    private function errorResponse(int $status, string $message, array $errors = [])
    {
        return response()->json([
            'message' => $message,
            'errors'  => $errors,
        ], $status);
    }
}
