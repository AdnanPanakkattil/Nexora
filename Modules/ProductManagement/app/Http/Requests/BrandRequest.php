<?php

namespace Modules\ProductManagement\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

/**
 * BrandRequest — Form Validation
 *
 * Validates form inputs for creating and updating Brand records.
 */
class BrandRequest extends FormRequest
{
    /**
     * Authorization check for request execution.
     * 
     * Output: bool (true allows request execution)
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Validation rules for brand data.
     *
     * Input: Request payload fields
     * Output: array of validation rules
     */
    public function rules(): array
    {
        return [
            'brandName_en' => 'required|string|max:255',
            'brandName_ar' => 'nullable|string|max:255',
        ];
    }

    /**
     * Custom validation error messages.
     *
     * Output: array of attribute-specific error messages
     */
    public function messages(): array
    {
        return [
            'brandName_en.required' => 'Brand Name (EN) is required.',
            'brandName_en.string'   => 'Brand Name (EN) must be a text string.',
            'brandName_en.max'      => 'Brand Name (EN) cannot exceed 255 characters.',
            'brandName_ar.string'   => 'Brand Name (AR) must be a text string.',
            'brandName_ar.max'      => 'Brand Name (AR) cannot exceed 255 characters.',
        ];
    }
}
