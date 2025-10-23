<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Illuminate\Database\QueryException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use App\Models\Address;
use Exception;

class AddressController extends Controller
{
    public function store(Request $request)
    {
        try {
            $data = $request->validate([
                'street'       => ['required','string','min:5'],
                'buildingName' => ['required','string','min:5'],
                'city'         => ['required','string','min:4'],
                'district'     => ['required','string','min:4'],
                'ward'         => ['required','string','min:4'],
            ]);

            $user = auth('api')->user();

            $payload = [];
            foreach ($data as $k => $v) {
                $payload[Str::snake($k)] = $v;
            }

            $address = DB::transaction(function () use ($payload, $user) {
                $address = new Address($payload);
                $address->user_id = $user->id;
                $address->save();
                return $address->fresh();
            });

            return response()->json($this->addressResponse($address), 201);
        } catch (ValidationException $e) {
            return $this->errorResponse(422, 'Validation failed', $e->errors());
        } catch (QueryException $e) {
            return $this->errorResponse(500, 'Database error', ['database' => [$e->getMessage()]]);
        } catch (Exception $e) {
            return $this->errorResponse(500, 'Server error', ['server' => [$e->getMessage()]]);
        }
    }

    public function update(Request $request, int $addressId)
    {
        try {
            $data = $request->validate([
                'street'       => ['sometimes','string','min:5'],
                'buildingName' => ['sometimes','string','min:5'],
                'city'         => ['sometimes','string','min:4'],
                'district'     => ['sometimes','string','min:4'],
                'ward'         => ['sometimes','string','min:4'],
            ]);

            $user = auth('api')->user();

            $address = Address::where('id', $addressId)
                ->where('user_id', $user->id)
                ->firstOrFail();

            $payload = [];
            foreach ($data as $k => $v) {
                $payload[Str::snake($k)] = $v;
            }

            $address->fill($payload)->save();

            return response()->json($this->addressResponse($address));
        } catch (ValidationException $e) {
            return $this->errorResponse(422, 'Validation failed', $e->errors());
        } catch (ModelNotFoundException $e) {
            return $this->errorResponse(404, 'Address not found', ['address' => ['Address does not exist or does not belong to the user.']]);
        } catch (QueryException $e) {
            return $this->errorResponse(500, 'Database error', ['database' => [$e->getMessage()]]);
        } catch (Exception $e) {
            return $this->errorResponse(500, 'Server error', ['server' => [$e->getMessage()]]);
        }
    }

    public function destroy(Request $request, int $addressId)
    {
        try {
            $user = auth('api')->user();

            $address = Address::where('id', $addressId)
                ->where('user_id', $user->id)
                ->firstOrFail();

            $address->delete();

            return response()->json(['message' => 'Delete address successfully'], 204);
        } catch (ModelNotFoundException $e) {
            return $this->errorResponse(404, 'Address not found', ['address' => ['Address does not exist or does not belong to the user.']]);
        } catch (QueryException $e) {
            return $this->errorResponse(500, 'Database error', ['database' => [$e->getMessage()]]);
        } catch (Exception $e) {
            return $this->errorResponse(500, 'Server error', ['server' => [$e->getMessage()]]);
        }
    }

    private function addressResponse(Address $a): array
    {
        return [
            'id'           => $a->id,
            'street'       => $a->street,
            'buildingName' => $a->building_name,
            'city'         => $a->city,
            'district'     => $a->district,
            'ward'         => $a->ward,
        ];
    }

    private function errorResponse(int $status, string $message, array $errors = [])
    {
        return response()->json([
            'message' => $message,
            'errors'  => $errors,
        ], $status);
    }
}
