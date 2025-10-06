<?php

namespace App\Http\Requests;

use App\Models\Inventory\ItemType;
use App\PermissionsEnum;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\File;

class NewEquipmentItemRequest extends FormRequest
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
            'description' => 'required|string|max:65535',
            'location' => 'required|string|max:255',
            'image' => ['nullable', File::image()->max('100mb')],
            'group_id' => ['required', Rule::anyOf([
                [Rule::exists('equipment_groups', 'id')],
                ['string', Rule::in(['new'])],
            ])],
            'group_name' => 'required_if:group_id,new|string|max:255',
            'group_type_id' => 'required_if:group_id,new|exists:' . ItemType::class . ',id',
        ];
    }
}
