<?php

namespace App\Http\Controllers;

use App\Http\Requests\BookUpdateRequest;
use App\Models\Books;
use Inertia\Inertia;

class BooksController extends Controller
{
  public function __construct()
  {
    $this->middleware(['can:view books']);
    $this->middleware(['can:edit books'])->only(['update', 'edit']);
    $this->middleware(['can:create books'])->only(['create', 'store']);
    $this->middleware(['can:delete books'])->only(['destroy']);
  }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {

      $books = Books::datagridRows();
      return Inertia::render('Books/Index', [
        'books' => $books
      ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
      return Inertia::render('Books/New');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(BookUpdateRequest $request)
    {
      $request->books = Books::create($request->validated());
    }

    /**
     * Display the specified resource.
     */
    public function show(Books $books)
    {
      return Inertia::render('Books/View', [
        'books' => $books
      ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Books $books)
    {
      return Inertia::render('Books/Edit', [
        'books' => $books
      ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(BookUpdateRequest $request, Books $books)
    {
      $request->books->fill($request->validated());
      $request->books->save();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Books $books)
    {
      $message = "$books->title has been deleted.";
      $books->delete();
      return to_route('books')->with('message', $message);
    }
}
