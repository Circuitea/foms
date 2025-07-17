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
            'duration' => 'required|numeric|gte:0',
            'type_id' => 'required|exists:' . TaskType::class . ',id',
            'priority_id' => 'required|exists:' . TaskPriority::class . ',id',
            'creator_id' => 'required|exists:' . Personnel::class . ',id',
            'personnel' => 'required|list',
        ];
    }
}
