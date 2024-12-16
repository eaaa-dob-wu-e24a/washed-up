<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\MachineController;
use App\Http\Controllers\QRCodeController;
use App\Http\Controllers\ScheduleController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CreditController;
use App\Http\Controllers\CreditPurchaseController;
use App\Http\Controllers\CreditUsageController;
use App\Http\Controllers\CronController;
use App\Http\Controllers\LocationController;
use App\Http\Controllers\StripeController;
use App\Http\Controllers\ExpoTokenController;
use App\Http\Controllers\LocationStatsController;
use App\Http\Controllers\NotifyerController;

// Authentication routes - no authentication required
Route::controller(AuthController::class)->group(function () {
    Route::post('validate', 'validate');         // Validate password strength/security
    Route::post('register', 'register');         // Register new user
    Route::post('login', 'login');              // Regular user login
    Route::post('admin-login', 'adminLogin');    // Admin-specific login
    Route::get('locations', [LocationController::class, 'index']);          // Get all locations
    Route::get('locations/code/{code}', [LocationController::class, 'getByCode']); // Get location by code

    Route::get('/cron/test', [CronController::class, 'index']); // Test notification system
});

// Protected routes - requires authentication
Route::middleware(['auth:sanctum'])->group(function () {
    // User & Authentication
    Route::get('/user', [AuthController::class, 'index']);                     // Get current user info

    // Machine Management
    Route::get('/machines', [MachineController::class, 'index']);             // List all machines in user's location
    Route::get('/machines/{id}', [MachineController::class, 'show']);         // Get specific machine details
    Route::get('/machines/code/{code}', [MachineController::class, 'findByCode']); // Find machine by QR code

    // Schedule Management
    Route::get('/schedule/{id}', [ScheduleController::class, 'getById']);     // Get specific schedule
    Route::delete('/schedule/{id}', [ScheduleController::class, 'destroy']);  // Cancel schedule without notification
    Route::get('/schedules', [ScheduleController::class, 'index']);          // List all schedules
    Route::get('/schedules/{id}', [ScheduleController::class, 'show']);      // Get machine schedules
    Route::post('/schedules', [ScheduleController::class, 'store']);         // Create new schedule
    Route::put('/schedules/{id}', [ScheduleController::class, 'update']);    // Update schedule
    Route::delete('/schedules/{id}', [ScheduleController::class, 'destroyWithNotification']); // Cancel with notification

    // Credits & Payments
    Route::get('/credits', [CreditController::class, 'index']);             // Get user credits
    Route::put('/credits', [CreditController::class, 'update']);            // Update user credits
    Route::get('/credit-purchases', [CreditPurchaseController::class, 'index']); // List credit purchase history
    Route::get('/credit-purchases/{id}', [CreditPurchaseController::class, 'show']); // Get specific purchase
    Route::get('/credit-usages', [CreditUsageController::class, 'index']);    // List credit usage history
    Route::get('/credit-usages/{id}', [CreditUsageController::class, 'show']); // Get specific usage
    Route::post('/payment/init', [StripeController::class, 'initializePayment']); // Initialize Stripe payment

    // Location
    Route::get('/location', [LocationController::class, 'show']);            // Get user's location details

    // Push Notifications
    Route::post('/expo-token', [ExpoTokenController::class, 'store']);       // Store Expo push token
    Route::delete('/expo-token', [ExpoTokenController::class, 'destroy']);   // Remove Expo push token
});

// Admin-only routes - requires authentication and admin role
Route::middleware(['auth:sanctum', 'admin'])->group(function () {
    // Analytics
    Route::get('/stats', [LocationStatsController::class, 'getStats']);      // Get location statistics

    // User Management
    Route::get('/users', [AuthController::class, 'list']);                   // List all users in location
    Route::get('/users/{id}', [AuthController::class, 'adminShow']);         // Get specific user details
    Route::get('/admin/schedules', [ScheduleController::class, 'adminIndex']); // List all schedules for admin

    // Machine Management
    Route::post('/machines', [MachineController::class, 'store']);           // Create new machine
    Route::put('/machines/{id}', [MachineController::class, 'update']);      // Update machine
    Route::delete('/machines/{id}', [MachineController::class, 'destroy']);  // Delete machine

    // Location Management
    Route::put('/location/pricing', [LocationController::class, 'updatePricing']); // Update location pricing

    // QR Code Management
    Route::get('/qrcodes', [QRCodeController::class, 'index']);             // List all QR codes
    Route::get('/qrcodes/{id}', [QRCodeController::class, 'show']);         // Get specific QR code
    Route::post('/qrcodes', [QRCodeController::class, 'store']);            // Create new QR code
    Route::put('/qrcodes/{id}', [QRCodeController::class, 'update']);       // Update QR code
    Route::delete('/qrcodes/{id}', [QRCodeController::class, 'destroy']);   // Delete QR code

    // Notification Management
    Route::get('/notifyer/users', [NotifyerController::class, 'users']);    // Get users with push tokens
    Route::post('/notifyer/send', [NotifyerController::class, 'sendNotification']); // Send push notification
});
