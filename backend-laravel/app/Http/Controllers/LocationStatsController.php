<?php

namespace App\Http\Controllers;

use App\Models\Schedule;
use App\Models\Machine;
use App\Models\CreditUsage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;

class LocationStatsController extends Controller
{
    private $timezone = 'Europe/Copenhagen';

    public function getStats(Request $request,)
    {
        // Validate request
        $request->validate([
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
        ]);

        $locationId = Auth::user()->location_id;
        // Convert dates to Copenhagen timezone and ensure full day coverage
        $startDate = Carbon::parse($request->input('start_date'), $this->timezone)->startOfDay()->utc();
        $endDate = Carbon::parse($request->input('end_date'), $this->timezone)->endOfDay()->utc();

        return response()->json([
            'machine_stats' => $this->getMachineStats($locationId),
            'usage_stats' => $this->getUsageStats($locationId, $startDate, $endDate),
            'revenue_stats' => $this->getRevenueStats($locationId, $startDate, $endDate),
            'refund_stats' => $this->getRefundStats($locationId, $startDate, $endDate),
            'peak_hours' => $this->getPeakHours($locationId, $startDate, $endDate),
            'machine_performance' => $this->getMachinePerformance($locationId, $startDate, $endDate),
        ]);
    }

    private function getMachineStats($locationId)
    {
        // No date filtering needed for current machine stats
        return Machine::where('location_id', $locationId)
            ->select([
                DB::raw('COUNT(*) as total_machines'),
                DB::raw('SUM(CASE WHEN type = "wash" THEN 1 ELSE 0 END) as washing_machines'),
                DB::raw('SUM(CASE WHEN type = "dry" THEN 1 ELSE 0 END) as dryers'),
                DB::raw('SUM(CASE WHEN status = 1 THEN 1 ELSE 0 END) as active_machines'),
                DB::raw('SUM(CASE WHEN status = 0 THEN 1 ELSE 0 END) as inactive_machines'),
            ])
            ->first();
    }

    private function getUsageStats($locationId, $startDate, $endDate)
    {
        return Schedule::join('machines', 'machines.id', '=', 'schedules.machine_id')
            ->where('machines.location_id', $locationId)
            ->whereBetween('schedules.start_time', [$startDate, $endDate])
            ->select([
                DB::raw('COUNT(*) as total_bookings'),
                DB::raw('COUNT(DISTINCT schedules.user_id) as unique_users'),
                DB::raw('AVG(TIMESTAMPDIFF(MINUTE, schedules.start_time, schedules.end_time)) as avg_duration_minutes'),
                DB::raw('SUM(TIMESTAMPDIFF(MINUTE, schedules.start_time, schedules.end_time)) as total_minutes_used'),
            ])
            ->first();
    }

    private function getRevenueStats($locationId, $startDate, $endDate)
    {
        // Generate all dates in range using the provided UTC dates
        $dates = collect(new \DatePeriod(
            $startDate,  // Already in UTC from getStats()
            new \DateInterval('P1D'),
            $endDate
        ))->map(function ($date) {
            // Convert to Copenhagen time for display
            return Carbon::parse($date)
                ->setTimezone($this->timezone)
                ->format('Y-m-d');
        });

        $stats = CreditUsage::join('machines', 'machines.id', '=', 'credit_usages.machine_id')
            ->where('machines.location_id', $locationId)
            ->where('credit_usages.type', 'purchase')
            ->whereBetween('credit_usages.created_at', [$startDate, $endDate])
            ->select([
                DB::raw('SUM(cost_credits) as total_credits_spent'),
                DB::raw('COUNT(DISTINCT credit_usages.user_id) as unique_paying_users'),
                DB::raw('AVG(cost_credits) as avg_transaction_value'),
                DB::raw("DATE_FORMAT(CONVERT_TZ(credit_usages.created_at, 'UTC', '" . $this->timezone . "'), '%Y-%m-%d') as date"),
            ])
            ->groupBy('date')
            ->get()
            ->keyBy('date');

        // Fill in missing dates with zero values
        return $dates->map(function ($date) use ($stats) {
            $data = $stats->get($date, [
                'date' => $date,
                'total_credits_spent' => '0',
                'unique_paying_users' => '0',
                'avg_transaction_value' => '0'
            ]);

            // Cast existing values to strings if they exist
            return [
                'date' => (string) $data['date'],
                'total_credits_spent' => (string) $data['total_credits_spent'],
                'unique_paying_users' => (string) $data['unique_paying_users'],
                'avg_transaction_value' => (string) $data['avg_transaction_value']
            ];
        })->values();
    }

    private function getRefundStats($locationId, $startDate, $endDate)
    {
        // Generate all dates in range using the provided UTC dates
        $dates = collect(new \DatePeriod(
            $startDate,  // Already in UTC from getStats()
            new \DateInterval('P1D'),
            $endDate
        ))->map(function ($date) {
            // Convert to Copenhagen time for display
            return Carbon::parse($date)
                ->setTimezone($this->timezone)
                ->format('Y-m-d');
        });

        $stats = CreditUsage::join('machines', 'machines.id', '=', 'credit_usages.machine_id')
            ->where('machines.location_id', $locationId)
            ->where('credit_usages.type', 'refund')
            ->whereBetween('credit_usages.created_at', [$startDate, $endDate])
            ->select([
                DB::raw('SUM(cost_credits) as total_credits_refunded'),
                DB::raw('COUNT(DISTINCT credit_usages.user_id) as unique_refunded_users'),
                DB::raw('AVG(cost_credits) as avg_refund_value'),
                DB::raw("DATE_FORMAT(CONVERT_TZ(credit_usages.created_at, 'UTC', '" . $this->timezone . "'), '%Y-%m-%d') as date"),
            ])
            ->groupBy('date')
            ->get()
            ->keyBy('date');

        // Fill in missing dates with zero values
        return $dates->map(function ($date) use ($stats) {
            $data = $stats->get($date, [
                'date' => $date,
                'total_credits_refunded' => '0',
                'unique_refunded_users' => '0',
                'avg_refund_value' => '0'
            ]);

            // Cast existing values to strings if they exist
            return [
                'date' => (string) $data['date'],
                'total_credits_refunded' => (string) $data['total_credits_refunded'],
                'unique_refunded_users' => (string) $data['unique_refunded_users'],
                'avg_refund_value' => (string) $data['avg_refund_value']
            ];
        })->values();
    }

    private function getPeakHours($locationId, $startDate, $endDate)
    {
        // Create array of all hours (0-23)
        $hours = collect(range(0, 23));

        $stats = Schedule::join('machines', 'machines.id', '=', 'schedules.machine_id')
            ->where('machines.location_id', $locationId)
            ->whereBetween('schedules.start_time', [$startDate, $endDate])
            ->select([
                DB::raw("HOUR(CONVERT_TZ(start_time, 'UTC', 'Europe/Copenhagen')) as hour"),
                DB::raw('COUNT(*) as booking_count'),
            ])
            ->groupBy('hour')
            ->get()
            ->keyBy('hour');

        // Fill in missing hours with zero values
        return $hours->map(function ($hour) use ($stats) {
            $data = $stats->get($hour, [
                'hour' => $hour,
                'booking_count' => '0'
            ]);

            // Cast existing values to strings if they exist
            return [
                'hour' => (string) $data['hour'],
                'booking_count' => (string) $data['booking_count']
            ];
        })->values();
    }

    private function getMachinePerformance($locationId, $startDate, $endDate)
    {
        return Machine::where('machines.location_id', $locationId)
            ->leftJoin('schedules', 'machines.id', '=', 'schedules.machine_id')
            ->leftJoin('credit_usages', function ($join) {
                $join->on('machines.id', '=', 'credit_usages.machine_id')
                    ->where('credit_usages.type', 'purchase'); // Only count purchases for revenue
            })
            ->whereBetween('schedules.start_time', [$startDate, $endDate])
            ->select([
                'machines.id',
                'machines.type',
                DB::raw('COUNT(DISTINCT schedules.id) as total_bookings'),
                DB::raw('SUM(credit_usages.cost_credits) as total_revenue'),
                DB::raw('AVG(TIMESTAMPDIFF(MINUTE, schedules.start_time, schedules.end_time)) as avg_usage_time'),
            ])
            ->groupBy('machines.id', 'machines.type')
            ->get();
    }
}
