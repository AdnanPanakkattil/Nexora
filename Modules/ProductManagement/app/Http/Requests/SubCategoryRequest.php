<?php

namespace Modules\ProductManagement\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SubCategoryRequest extends FormRequest
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
     */
    public function rules(): array
    {
        return [
            'category_id'        => 'required|exists:Categories,id',
            'subCategoryName_en' => 'required|string|max:255',
            'subCategoryName_ar' => 'required|string|max:255',
            'memberPhoto'        => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'category_id.required'        => 'Please select a parent category.',
            'category_id.exists'          => 'The selected category is invalid.',
            'subCategoryName_en.required' => 'Sub Category Name in English is required.',
            'subCategoryName_ar.required' => 'Sub Category Name in Arabic is required.',
            'memberPhoto.image'           => 'The file must be an image.',
            'memberPhoto.max'             => 'Image size must not exceed 2MB.',
        ];
    }
}
