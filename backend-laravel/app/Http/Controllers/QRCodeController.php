<?php

namespace App\Http\Controllers;

use App\Models\QRCode;
use Illuminate\Http\Request;

class QRCodeController extends Controller {
    public function index() {
        $qrcodes = QRCode::all();
        return response()->json($qrcodes);
    }

    public function show($id) {
        $qrcode = QRCode::findOrFail($id);
        return response()->json($qrcode);
    }

    public function store(Request $request) {
        $qrcode = QRCode::create($request->all());
        return response()->json($qrcode, 201);
    }

    public function update(Request $request, $id) {
        $qrcode = QRCode::findOrFail($id);
        $qrcode->update($request->all());
        return response()->json($qrcode, 200);
    }

    public function destroy($id) {
        QRCode::destroy($id);
        return response()->json(null, 204);
    }
}
