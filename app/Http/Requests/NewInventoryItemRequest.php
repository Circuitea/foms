<?php

namespace App\Http\Requests;

use App\Models\Inventory\ItemType;
use App\PermissionsEnum;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rules\File;

class NewInventoryItemRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return Auth::user()->can(PermissionsEnum::INVENTORY_CREATE);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'type_id' => 'required|exists:' . ItemType::class . ',id',
            'location' => 'required|string|max:255',
            'initial_quantity' => 'required|integer|gte:1',
            'description' => 'required|string|max:65535',
            'image' => ['nullable', File::image()->max('100mb')],
        ];
    }
}
