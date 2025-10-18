<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Illuminate\Database\QueryException;
use Tymon\JWTAuth\Facades\JWTAuth;
use App\Models\User;
use Exception;

class AuthController extends Controller
{
    public function signup(Request $request)
    {
        try {
            $data = $request->validate([
                'username' => ['required','string','max:255', Rule::unique('users','user_name')],
                'email'    => ['required','email','max:255', Rule::unique('users','email')],
                'password' => ['required','string','min:6'],
                'role'     => ['sometimes'],
            ]);

            $username = mb_strtolower(trim($data['username']), 'UTF-8');
            $email = mb_strtolower(trim($data['email']), 'UTF-8');

            if (User::where('user_name', $username)->exists()) {
                return $this->errorResponse(409, 'Username already taken', ['username' => ['The username has already been taken.']]);
            }
            if (User::where('email', $email)->exists()) {
                return $this->errorResponse(409, 'Email already taken', ['email' => ['The email has already been taken.']]);
            }

            [$user, $token] = DB::transaction(function () use ($request, $username, $email) {
                $user = User::create([
                    'user_name' => $username,
                    'email'     => $email,
                    'password'  => $request->input('password'),
                ]);

                $roles = $this->normalizeRoles($request->input('role', ['user']));
                if (empty($roles)) {
                    $roles = ['user'];
                }

                $roleIds = [];
                foreach ($roles as $r) {
                    $r = mb_strtolower(trim($r), 'UTF-8');
                    if ($r === '') continue;
                    $roleId = DB::table('roles')->where('name', $r)->value('id');
                    if (!$roleId) {
                        $roleId = DB::table('roles')->insertGetId(['name' => $r, 'created_at' => now(), 'updated_at' => now()]);
                    }
                    $roleIds[] = $roleId;
                }
                $roleIds = array_unique($roleIds);
                if (!empty($roleIds)) {
                    $rows = array_map(function ($rid) use ($user) {
                        return ['user_id' => $user->id, 'role_id' => $rid];
                    }, $roleIds);
                    DB::table('role_user')->insert($rows);
                }

                $token = JWTAuth::fromUser($user);
                return [$user, $token];
            });

            $roles = DB::table('roles')
                ->join('role_user', 'roles.id', '=', 'role_user.role_id')
                ->where('role_user.user_id', $user->id)
                ->pluck('roles.name')
                ->toArray();

            return response()->json([
                'username' => $user->user_name,
                'roles'    => array_values($roles),
                'jwtToken' => $token,
            ], 201);
        } catch (ValidationException $e) {
            return $this->errorResponse(422, 'Validation failed', $e->errors());
        } catch (QueryException $e) {
            if ($this->isUniqueViolation($e)) {
                return $this->errorResponse(409, 'Duplicate key', ['duplicate' => ['A unique constraint was violated.']]);
            }
            return $this->errorResponse(500, 'Database error', ['database' => [$e->getMessage()]]);
        } catch (Exception $e) {
            return $this->errorResponse(500, 'Server error', ['server' => [$e->getMessage()]]);
        }
    }

    public function login(Request $request)
    {
        try {
            $data = $request->validate([
                'username' => ['required','string'],
                'password' => ['required','string'],
            ]);

            $credentials = [
                'user_name' => mb_strtolower(trim($data['username']), 'UTF-8'),
                'password'  => $data['password'],
            ];

            if (!$token = JWTAuth::attempt($credentials)) { return response()->json(['message' => 'Invalid credentials'], 401); }

            $user = \Tymon\JWTAuth\Facades\JWTAuth::setToken($token)->authenticate();

            $roles = DB::table('roles')
                ->join('role_user', 'roles.id', '=', 'role_user.role_id')
                ->where('role_user.user_id', $user->id)
                ->pluck('roles.name')
                ->toArray();

            return response()->json([
                'username' => $user->user_name,
                'roles'    => array_values($roles),
                'jwtToken' => $token,
            ]);
        } catch (ValidationException $e) {
            return $this->errorResponse(422, 'Validation failed', $e->errors());
        } catch (QueryException $e) {
            return $this->errorResponse(500, 'Database error', ['database' => [$e->getMessage()]]);
        } catch (Exception $e) {
            return $this->errorResponse(500, 'Server error', ['server' => [$e->getMessage()]]);
        }
    }

    public function me(Request $request)
    {
        try {
            $user = auth('api')->user();
            if (!$user) {
                return $this->errorResponse(401, 'Unauthenticated', ['auth' => ['Token is missing or invalid.']]);
            }

            $roles = DB::table('roles')
                ->join('role_user', 'roles.id', '=', 'role_user.role_id')
                ->where('role_user.user_id', $user->id)
                ->pluck('roles.name')
                ->toArray();

            return response()->json([
                'userName' => $user->user_name,
                'roles'    => array_values($roles),
            ]);
        } catch (QueryException $e) {
            return $this->errorResponse(500, 'Database error', ['database' => [$e->getMessage()]]);
        } catch (Exception $e) {
            return $this->errorResponse(500, 'Server error', ['server' => [$e->getMessage()]]);
        }
    }

    public function logout(Request $request)
    {
        try {
            $token = JWTAuth::getToken();
            if (!$token) {
                return $this->errorResponse(400, 'No token', ['auth' => ['Authorization token is required.']]);
            }
            JWTAuth::invalidate($token);
            return response()->json(['message' => 'Logged out']);
        } catch (Exception $e) {
            return $this->errorResponse(500, 'Server error', ['server' => [$e->getMessage()]]);
        }
    }

    private function normalizeRoles($raw)
    {
        if ($raw === null) return [];
        if (is_string($raw)) {
            return array_filter(array_map('trim', explode(',', $raw)));
        }
        if (is_array($raw)) {
            if (count($raw) === 1 && is_string($raw[0]) && str_contains($raw[0], ',')) {
                return array_filter(array_map('trim', explode(',', $raw[0])));
            }
            return array_values(array_filter(array_map(function ($v) {
                return is_string($v) ? trim($v) : '';
            }, $raw)));
        }
        return [];
    }

    private function isUniqueViolation(QueryException $e): bool
    {
        $sqlState = $e->errorInfo[0] ?? null;
        $driverCode = (string)($e->errorInfo[1] ?? '');
        if ($sqlState === '23505') return true;
        if ($driverCode === '1062') return true;
        return false;
    }

    private function errorResponse(int $status, string $message, array $errors = [])
    {
        return response()->json([
            'message' => $message,
            'errors'  => $errors,
        ], $status);
    }
}
