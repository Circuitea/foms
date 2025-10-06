<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class NewTransactionRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string', 'max:65535'],
            'entries' => ['required', 'array', 'min:1'],
            'entries.*.type' => ['required', 'in:equipment,consumable'],
            'entries.*.item_id' => ['required', 'integer', Rule::anyOf([
                ['exists:equipment_items,id'],
                ['exists:consumable_items,id'],
            ])],
            'entries.*.quantity' => [
                'required_if:entries.*.type,consumable',
                'integer',
                'min:1',
            ],
        ];
    }
}
