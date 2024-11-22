<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ClerkController extends Controller
{
    public function updateMetadata(Request $request, $id)
    {
        $body = $request->all();

        $curl = curl_init();

        curl_setopt_array($curl, array(
            CURLOPT_URL => 'https://api.clerk.com/v1/users/' . $id . '/metadata',
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => '',
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 0,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => 'PATCH',
            CURLOPT_POSTFIELDS => json_encode($body),
            CURLOPT_HTTPHEADER => array(
                'Content-Type: application/json',
                'Authorization: Bearer ' . env('CLERK_API_KEY'),
            ),
        ));

        $response = curl_exec($curl);

        curl_close($curl);

        // Decode the response
        $decodedResponse = json_decode($response, true);

        // Check if the response is valid JSON
        if (json_last_error() === JSON_ERROR_NONE) {
            return response()->json($decodedResponse, 200);
        } else {
            return response()->json(['error' => 'Invalid JSON response from API', 'raw_response' => $response], 500);
        }
    }
}
