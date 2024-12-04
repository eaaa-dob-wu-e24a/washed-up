<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCreditPurchasesTable extends Migration
{
    public function up()
    {
        Schema::create('credit_purchases', function (Blueprint $table) {
            $table->id(); // Primary key
            $table->foreignId('user_id')->constrained()->cascadeOnDelete(); // Foreign key to users table
            $table->decimal('credits_bought', 10, 2); // Number of credits bought
            $table->decimal('balance_after', 10, 2); // Balance after the transaction
            $table->decimal('price', 10, 2); // Price paid for credits
            $table->string('currency', 10); // Currency used
            $table->string('payment_method'); // Payment method (e.g., credit card)
            $table->timestamps(); // Created and updated timestamps
        });
    }

    public function down()
    {
        Schema::dropIfExists('credit_purchases');
    }
}
