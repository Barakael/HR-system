<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('departments', function (Blueprint $table) {
            $table->string('code')->nullable()->unique()->after('name');
            $table->text('positions')->nullable()->after('description');
            $table->foreignId('station_id')->nullable()->after('positions')->constrained('stations')->nullOnDelete();
            $table->boolean('active')->default(true)->after('station_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('departments', function (Blueprint $table) {
            $table->dropColumn(['code', 'positions', 'station_id', 'active']);
        });
    }
};
