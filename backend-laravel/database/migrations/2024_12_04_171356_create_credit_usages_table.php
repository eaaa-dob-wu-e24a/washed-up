<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCreditUsagesTable extends Migration
{
    public function up()
    {
        Schema::create('credit_usages', function (Blueprint $table) {
            $table->id(); // Primary key
            $table->foreignId('user_id')->constrained()->cascadeOnDelete(); // Foreign key to users table
            $table->bigInteger('machine_id'); // Reference to the machine used
            $table->string('machine_type'); // Type of machine (e.g., washing, dryer)
            $table->integer('duration_minutes'); // Duration of machine usage
            $table->decimal('cost_credits', 10, 2); // Cost in credits
            $table->decimal('balance_after', 10, 2); // Balance after the transaction
            $table->string('type')->default('purchase'); // Whether the transaction was a purchase or a refund
            $table->timestamps(); // Created and updated timestamps
        });
    }

    public function down()
    {
        Schema::dropIfExists('credit_usages');
    }
}
