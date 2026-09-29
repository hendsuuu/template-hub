<?php

use Illuminate\Support\Facades\Route;

// The Agent hub pages. Board, Jobs, Schedules and Agents are linked from the
// navigation but not part of this starter: build them from the Next.js one.
Route::view('/', 'agent-hub.overview')->name('overview');
Route::view('/components', 'agent-hub.components')->name('components');
Route::view('/login', 'agent-hub.login')->name('login');
