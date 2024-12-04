<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\BookController;
use App\Http\Controllers\MachineController;
use App\Http\Controllers\QRCodeController;
use App\Http\Controllers\ScheduleController;
use App\Http\Controllers\ClerkController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CreditController;
use App\Http\Controllers\LocationController;

Route::controller(AuthController::class)->group(function () {
    Route::post('validate', 'validate');
    Route::post('register', 'register');
    Route::post('login', 'login');
    Route::post('admin-login', 'adminLogin');
    Route::get('locations', [LocationController::class, 'index']);
    Route::get('locations/code/{code}', [LocationController::class, 'getByCode']);
});

Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/user', [AuthController::class, 'index']);
    Route::patch("/clerk-metadata/{id}", [ClerkController::class, 'updateMetadata']);

    Route::get('/machines', [MachineController::class, 'index']);
    Route::get('/machines/{id}', [MachineController::class, 'show']);
    Route::post('/machines', [MachineController::class, 'store']);
    Route::put('/machines/{id}', [MachineController::class, 'update']);
    Route::delete('/machines/{id}', [MachineController::class, 'destroy']);
    Route::get('/machines/code/{code}', [MachineController::class, 'findByCode']);

    Route::get('/qrcodes', [QRCodeController::class, 'index']);
    Route::get('/qrcodes/{id}', [QRCodeController::class, 'show']);
    Route::post('/qrcodes', [QRCodeController::class, 'store']);
    Route::put('/qrcodes/{id}', [QRCodeController::class, 'update']);
    Route::delete('/qrcodes/{id}', [QRCodeController::class, 'destroy']);

    Route::get('/schedules', [ScheduleController::class, 'index']);
    Route::get('/schedules/{id}', [ScheduleController::class, 'show']);
    Route::post('/schedules', [ScheduleController::class, 'store']);
    Route::put('/schedules/{id}', [ScheduleController::class, 'update']);
    Route::delete('/schedules/{id}', [ScheduleController::class, 'destroy']);

    Route::get('/credits', [CreditController::class, 'index']);
    Route::post('/credits', [CreditController::class, 'store']);
    Route::put('/credits', [CreditController::class, 'update']);
    Route::delete('/credits', [CreditController::class, 'destroy']);
});

Route::middleware(['auth:sanctum', 'admin'])->group(function () {
    Route::get('/users', [AuthController::class, 'list']);
    Route::get('/users/{id}', [AuthController::class, 'adminShow']);

    Route::get('/location', [LocationController::class, 'show']);
    Route::get('/books', [BookController::class, 'index']);
    Route::get('/books/{id}', [BookController::class, 'show']);
    Route::post('/books', [BookController::class, 'store']);
    Route::put('/books/{id}', [BookController::class, 'update']);
    Route::delete('/books/{id}', [BookController::class, 'destroy']);
});
