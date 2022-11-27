
;; time-wallet
;; <add a description here>

(define-read-only (get-time)
    (get-block-info? time block-height)
)
