<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use App\Models\User;
use Illuminate\Support\Facades\Http;

class AuthController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        if ($user) {
            return response()->json($user);
        } else {
            return response()->json([
                'message' => 'Unauthenticated'
            ], 401);
        }
    }
    public function register(Request $request)
    {
        $validate = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|unique:users',
            'password' => 'required|string|min:8',
            'c_password' => 'required|same:password',
            'location_id' => 'required|exists:locations,id',
            'role' => 'nullable|string|in:admin,user'
        ]);

        if ($validate->fails()) {
            return response()->json($validate->errors(), 400);
        }

        $user = new User([
            'name' => $request->name,
            'email' => $request->email,
            'email_verified_at' => now(),
            'password' => Hash::make($request->password),
            'location_id' => $request->location_id,
            'role' => $request->role ?? 'user'
        ]);

        $user->save();

        $token = $user->createToken('authToken')->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'role' => $user->role
        ]);
    }
    public function validate(Request $request)
    {
        $validate = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|unique:users',
            'password' => 'required|string|min:8',
            'c_password' => 'required|same:password',
        ]);

        if ($validate->fails()) {
            return response()->json($validate->errors(), 400);
        }

        // Check if password has been pwned
        $password = $request->password;
        $sha1Password = strtoupper(sha1($password));
        $prefix = substr($sha1Password, 0, 5);
        $suffix = substr($sha1Password, 5);

        $response = Http::get("https://api.pwnedpasswords.com/range/" . $prefix);

        if ($response->successful()) {
            $hashes = explode("\n", $response->body());
            foreach ($hashes as $hash) {
                list($hashSuffix, $count) = explode(":", trim($hash));
                if (strcasecmp($hashSuffix, $suffix) === 0) {
                    return response()->json([
                        "password" => ["This password has been exposed in data breaches. Please choose a different password."]
                    ]);
                }
            }
        }

        return response()->json([
            'success' => true
        ]);
    }
    public function login(Request $request)
    {
        if (!Auth::attempt($request->only('email', 'password'))) {
            return response()->json([
                'message' => 'Invalid login details'
            ], 401);
        }

        $user = User::where('email', $request->email)->firstOrFail();

        $token = $user->createToken('authToken')->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'role' => $user->role,
        ]);
    }

    public function adminLogin(Request $request)
    {
        if (!Auth::attempt($request->only('email', 'password'))) {
            return response()->json([
                'message' => 'Invalid login details'
            ], 401);
        }

        $user = User::where('email', $request->email)->firstOrFail();

        if ($user->role !== 'admin') {
            return response()->json([
                'message' => 'Unauthorized. Admin access only'
            ], 403);
        }

        $token = $user->createToken('authToken')->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'role' => $user->role,
        ]);
    }
}
