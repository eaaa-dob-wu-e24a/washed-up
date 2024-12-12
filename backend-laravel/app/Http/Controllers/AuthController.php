<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use App\Models\User;
use Illuminate\Support\Facades\Http;
use App\Models\Credits;

class AuthController extends Controller {
    public function index() {
        $user = Auth::user();
        if ($user) {
            return response()->json($user);
        } else {
            return response()->json([
                'message' => 'Unauthenticated'
            ], 401);
        }
    }

    public function list() {
        $authUser = Auth::user();
        $users = User::where('location_id', $authUser->location_id)->get();
        return response()->json($users);
    }

    public function adminShow($id) {
        $authUser = Auth::user();
        $user = User::with(['credits', 'schedules'])
            ->where('location_id', $authUser->location_id)
            ->find($id);

        if (!$user) {
            return response()->json([
                'message' => 'User not found or unauthorized'
            ], 403);
        }

        return response()->json($user);
    }

    public function register(Request $request) {
        $validate = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|unique:users',
            'password' => 'required|string|min:8',
            'c_password' => 'required|same:password',
            'location_id' => 'required|exists:locations,id',
            'role' => 'nullable|string|in:admin,user'
        ], [
            'name.required' => 'Please enter your name',
            'name.max' => 'Name cannot be longer than 255 characters',
            'email.required' => 'Please enter your email address',
            'email.email' => 'Please enter a valid email address',
            'email.unique' => 'This email is already registered',
            'password.required' => 'Please enter a password',
            'password.min' => 'Password must be at least 8 characters long',
            'c_password.required' => 'Please confirm your password',
            'c_password.same' => 'Passwords do not match',
            'location_id.required' => 'Please select a location',
            'location_id.exists' => 'Selected location is invalid',
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
                    ], 400);
                }
            }
        }

        $user = new User([
            'name' => $request->name,
            'email' => $request->email,
            'email_verified_at' => Carbon::now(),
            'password' => Hash::make($request->password),
            'location_id' => $request->location_id,
            'role' => $request->role ?? 'user'
        ]);

        $user->save();

        // Create initial credits for the user
        Credits::create([
            'user_id' => $user->id,
            'amount' => 0  // Set initial credit amount to 0
        ]);

        $token = $user->createToken('authToken')->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'role' => $user->role
        ]);
    }

    public function validate(Request $request) {
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
    public function login(Request $request) {
        if (!Auth::attempt($request->only('email', 'password'))) {
            return response()->json([
                'message' => "Invalid login details. Please try again."
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

    public function adminLogin(Request $request) {
        if (!Auth::attempt($request->only('email', 'password'))) {
            return response()->json([
                'message' => "Invalid login details. Please try again."
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
