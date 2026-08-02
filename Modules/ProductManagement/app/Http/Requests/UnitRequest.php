<?php

namespace Modules\ProductManagement\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

/**
 * UnitRequest — Form Validation
 *
 * Unit create/update ചെയ്യുമ്പോൾ ഈ request class validation handle ചെയ്യും.
 *
 * Input fields validate ചെയ്യുന്നത്:
 *   - unitName_en : required, string, max 255 chars  → English name
 *   - unitName_ar : required, string, max 255 chars  → Arabic name
 *   - short_name  : optional, string, max 50 chars   → Abbreviation (kg, pcs...)
 */
class UnitRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * Return: true → All logged-in users can submit this form.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * Input  : Form submit ചെയ്യുമ്പോൾ request-ൽ ഉള്ള values.
     * Output : Validation rules array.
     *
     * Rules:
     *   unitName_en → required | string | max:255
     *   unitName_ar → required | string | max:255
     *   short_name  → nullable | string | max:50
     */
    public function rules(): array
    {
        return [
            'unitName_en' => 'required|string|max:255',
            'unitName_ar' => 'required|string|max:255',
            'short_name' => 'nullable|string|max:50',
        ];
    }

    /**
     * Get custom validation error messages.
     *
     * Output: User-friendly error messages array.
     */
    public function messages(): array
    {
        return [
            'unitName_en.required' => 'Unit Name in English is required.',
            'unitName_ar.required' => 'Unit Name in Arabic is required.',
            'short_name.max' => 'Short name must not exceed 50 characters.',
        ];
    }
}
