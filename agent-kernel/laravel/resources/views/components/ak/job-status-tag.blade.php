@props(['status'])
@use('App\Support\AgentHub\Status')
@php($info = Status::JOB[$status])
<span class="ak-tag ak-tag--{{ $info['tone'] }}" title="{{ $info['meaning'] }}">
    <span class="ak-tag__mark" aria-hidden="true"></span>
    {{ $info['label'] }}
</span>
