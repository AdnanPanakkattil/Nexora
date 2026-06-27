<?php

namespace Modules\ProductManagement\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Modules\ProductManagement\Models\ItemMaster;

class ItemMasterController extends Controller
{
    /**
     * Display a listing of all item masters.
     */
    public function index()
    {
        $items = ItemMaster::latest()->get();
        return view('productmanagement::item-master.index', compact('items'));
    }

    /**
     * Show the form for creating a new item.
     */
    public function create()
    {
        return view('productmanagement::item-master.create');
    }

    /**
     * Store a newly created item in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'item_code'      => 'required|unique:item_masters,item_code',
            'item_name'      => 'required|string|max:255',
            'selling_price'  => 'required|numeric|min:0',
            'purchase_price' => 'required|numeric|min:0',
        ]);

        ItemMaster::create($request->all());

        return redirect()->route('item-master.index')
            ->with('success', 'Item created successfully.');
    }

    /**
     * Show the form for editing the specified item.
     */
    public function edit($id)
    {
        $item = ItemMaster::findOrFail($id);
        return view('productmanagement::item-master.edit', compact('item'));
    }

    /**
     * Update the specified item in storage.
     */
    public function update(Request $request, $id)
    {
        $item = ItemMaster::findOrFail($id);

        $request->validate([
            'item_code'      => 'required|unique:item_masters,item_code,' . $id,
            'item_name'      => 'required|string|max:255',
            'selling_price'  => 'required|numeric|min:0',
            'purchase_price' => 'required|numeric|min:0',
        ]);

        $item->update($request->all());

        return redirect()->route('item-master.index')
            ->with('success', 'Item updated successfully.');
    }

    /**
     * Remove the specified item from storage.
     */
    public function destroy($id)
    {
        $item = ItemMaster::findOrFail($id);
        $item->delete();

        return redirect()->route('item-master.index')
            ->with('success', 'Item deleted successfully.');
    }
}
