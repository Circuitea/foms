<?php

namespace App\Models\Inventory;

use App\Models\Personnel;
use App\Notifications\EquipmentNeedMaintenance;
use App\RolesEnum;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Notification;

class EquipmentTransactionEntry extends Model
{
  public $timestamps = false;

  public function item(): BelongsTo
  {
    return $this->belongsTo(EquipmentItem::class, 'item_id');
  }

  public function transaction(): BelongsTo
  {
    return $this->belongsTo(Transaction::class, 'transaction_id');
  }

  protected static function booted()
  {
    static::created(function (EquipmentTransactionEntry $entry) {
      $item = $entry->item;

      $result = DB::selectOne('
          SELECT 
              CASE 
                  WHEN EXISTS (
                      SELECT 1 FROM equipment_transaction_entries as ete_check
                      WHERE ete_check.item_id = ?
                      AND ete_check.is_maintenance = true
                  )
                  THEN (
                      SELECT COUNT(*)
                      FROM equipment_transaction_entries as ete
                      WHERE ete.item_id = ?
                      AND ete.id > (
                          SELECT MAX(ete2.id)
                          FROM equipment_transaction_entries as ete2
                          WHERE ete2.item_id = ?
                          AND ete2.is_maintenance = true
                      )
                  )
                  ELSE (
                      SELECT COUNT(*)
                      FROM equipment_transaction_entries as ete
                      WHERE ete.item_id = ?
                  )
              END as transactions_count
      ', [$item->id, $item->id, $item->id, $item->id]);

      if (($result->transactions_count ?? 0) >= $item->use_before_maintenance ?? 0) {
          $personnel = Personnel::all()
          ->filter(fn ($person) => $person->hasRole([RolesEnum::ADMIN, RolesEnum::LOGISTIC]));

          Notification::send(
            $personnel,
            new EquipmentNeedMaintenance(
              $item, $result->transactions_count ?? 0,
            ),
          );
      }
    });
  }
}
