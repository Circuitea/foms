<?php

namespace App\Http\Requests;

use App\Models\Personnel;
use App\Models\Task\TaskPriority;
use App\Models\Task\TaskType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class NewTaskRequest extends FormRequest
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
            'title' => 'required|string|max:255',
            'description' => 'required|string|max:255',
            'location' => 'required|string|max:255',
            'due_date' => ['required', 'date', Rule::date()->afterToday()],
            'type_id' => 'required|exists:' . TaskType::class . ',id',
            'priority_id' => 'required|exists:' . TaskPriority::class . ',id',
            'items' => ['required', 'array'],
            'items.equipment' => ['nullable', 'array'],
            'items.equipment.*' => ['integer', 'exists:equipment_items,id'],
            'items.consumables' => ['nullable', 'array'],
            'items.consumables.*.id' => ['required_with:items.consumables', 'integer', 'exists:consumable_items,id'],
            'items.consumables.*.count' => ['required_with:items.consumables', 'integer', 'min:1'],
            'personnel' => 'nullable|list',
            'location_latitude' => 'nullable|number',
            'location_longitude' => 'nullable|number',
        ];
    }
}
