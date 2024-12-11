<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\BookController;
use App\Http\Controllers\MachineController;
use App\Http\Controllers\QRCodeController;
use App\Http\Controllers\ScheduleController;
use App\Http\Controllers\ClerkController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CreditController;
use App\Http\Controllers\CreditPurchaseController;
use App\Http\Controllers\CreditUsageController;
use App\Http\Controllers\CronController;
use App\Http\Controllers\LocationController;
use App\Http\Controllers\StripeController;
use App\Http\Controllers\ExpoTokenController;
use App\Http\Controllers\LocationStatsController;

Route::controller(AuthController::class)->group(function () {
    Route::post('validate', 'validate');
    Route::post('register', 'register');
    Route::post('login', 'login');
    Route::post('admin-login', 'adminLogin');
    Route::get('locations', [LocationController::class, 'index']);
    Route::get('locations/code/{code}', [LocationController::class, 'getByCode']);

    Route::get('/cron/test', [CronController::class, 'index']);
});

Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/user', [AuthController::class, 'index']);
    Route::patch("/clerk-metadata/{id}", [ClerkController::class, 'updateMetadata']);

    Route::get('/machines', [MachineController::class, 'index']);
    Route::get('/machines/{id}', [MachineController::class, 'show']);
    Route::get('/machines/code/{code}', [MachineController::class, 'findByCode']);

    Route::get('/schedule/{id}', [ScheduleController::class, 'getById']);     // Get schedules by a specific schedule ID
    Route::delete('/schedule/{id}', [ScheduleController::class, 'destroy']); // Delete a schedule by ID (without notification)

    Route::get('/schedules', [ScheduleController::class, 'index']);
    Route::get('/schedules/{id}', [ScheduleController::class, 'show']);     // Get schedules for a specific machine
    Route::post('/schedules', [ScheduleController::class, 'store']);
    Route::put('/schedules/{id}', [ScheduleController::class, 'update']);
    Route::delete('/schedules/{id}', [ScheduleController::class, 'destroyWithNotification']); // Delete a schedule by ID (with admin notification)

    Route::get('/credits', [CreditController::class, 'index']);
    Route::put('/credits', [CreditController::class, 'update']);

    Route::get('/location', [LocationController::class, 'show']);

    Route::get('/credit-purchases', [CreditPurchaseController::class, 'index']);
    Route::get('/credit-purchases/{id}', [CreditPurchaseController::class, 'show']);

    Route::get('/credit-usages', [CreditUsageController::class, 'index']);
    Route::get('/credit-usages/{id}', [CreditUsageController::class, 'show']);

    Route::post('/payment/init', [StripeController::class, 'initializePayment']);
    Route::post('/expo-token', [ExpoTokenController::class, 'store']);
    Route::delete('/expo-token', [ExpoTokenController::class, 'destroy']);
});

Route::middleware(['auth:sanctum', 'admin'])->group(function () {
    Route::get('/stats', [LocationStatsController::class, 'getStats'])
        ->middleware('auth:sanctum');

    Route::get('/users', [AuthController::class, 'list']);
    Route::get('/users/{id}', [AuthController::class, 'adminShow']);

    Route::get('/schedules/admin', [ScheduleController::class, 'adminIndex']);

    Route::post('/machines', [MachineController::class, 'store']);
    Route::put('/machines/{id}', [MachineController::class, 'update']);
    Route::delete('/machines/{id}', [MachineController::class, 'destroy']);

    Route::get('/qrcodes', [QRCodeController::class, 'index']);
    Route::get('/qrcodes/{id}', [QRCodeController::class, 'show']);
    Route::post('/qrcodes', [QRCodeController::class, 'store']);
    Route::put('/qrcodes/{id}', [QRCodeController::class, 'update']);
    Route::delete('/qrcodes/{id}', [QRCodeController::class, 'destroy']);
});
