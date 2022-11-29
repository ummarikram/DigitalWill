;; Digital Will NFT Smart Contract

;; non-fungible token
(define-non-fungible-token digital-will uint)

;; data maps and vars

(define-map will-data { id: uint } {claimed: bool, unlock-time: uint, amount: uint, donor: principal, url: (buff 256)})
(define-constant ERR_NOT_OWNER (err u999))
(define-constant ERR_NOT_VALID_BENEFICIARY (err u998))
(define-constant ERR_PAST_UNLOCK_TIME (err u997))
(define-constant ERR_FUTURE_UNLOCK_TIME (err u996))
(define-constant ERR_NOT_VALID_AMOUNT (err u995))
(define-constant ERR_ALREADY_CLAIMED (err u994))
(define-data-var current-id uint u0)

;; read-only functions

(define-read-only (get-last-token-id)
    (ok (var-get current-id))
)

(define-read-only (get-will-data (id uint))
    (map-get? will-data { id: id })
)

(define-read-only (get-owner (id uint))
    (nft-get-owner? digital-will id)
)

(define-read-only (get-token-uri (id uint))
    (unwrap-panic (get url (map-get? will-data { id: id })))
)

(define-read-only (is-claimed (id uint))
    (unwrap-panic (get claimed (map-get? will-data { id: id })))
)

(define-read-only (get-donor (id uint))
    (unwrap-panic (get donor (map-get? will-data { id: id })))
)

(define-read-only (get-unlock-time (id uint))
    (unwrap-panic (get unlock-time (map-get? will-data { id: id })))
)

(define-read-only (get-amount (id uint))
    (unwrap-panic (get amount (map-get? will-data { id: id })))
)

(define-read-only (get-current-timestamp)
    (unwrap-panic (get-block-info? time (- block-height u1)))
)


;; public functions

(define-public (transfer (id uint) (sender principal) (reciever principal))
    (begin
        (asserts! (is-eq tx-sender sender) ERR_NOT_OWNER)
        (nft-transfer? digital-will id sender reciever)
    )
)

(define-public (mint (beneficiary principal) (unlock-time uint) (amount uint) (url (buff 256)))

    (let
        (
            (token-id (+ (var-get current-id) u1))
        )

        (asserts! (not (is-eq beneficiary tx-sender)) ERR_NOT_VALID_BENEFICIARY)
        (asserts! (is-eq (ok true) (lock unlock-time amount)) ERR_NOT_VALID_BENEFICIARY)    
        (try! (nft-mint? digital-will token-id beneficiary))
        (map-insert will-data { id: token-id } {claimed: false, unlock-time: unlock-time, amount: amount, donor: tx-sender, url: url})
        (var-set current-id token-id)
        (ok token-id)
    )
)

(define-private (lock (unlock-time uint) (amount uint))
    (begin
        (asserts! (> unlock-time (unwrap-panic (get-block-info? time (- block-height u1)))) ERR_PAST_UNLOCK_TIME)
        (asserts! (> amount u0) ERR_NOT_VALID_AMOUNT)
        (try! (stx-transfer? amount tx-sender (as-contract tx-sender)))
        (ok true)
    )
)

(define-public (claim (id uint))
    (begin
        (asserts! (is-eq (some tx-sender) (get-owner id)) ERR_NOT_OWNER)
        (asserts! (is-eq false (is-claimed id)) ERR_ALREADY_CLAIMED)
        (asserts! (>= (unwrap-panic (get-block-info? time (- block-height u1))) (get-unlock-time id)) ERR_FUTURE_UNLOCK_TIME)
        (asserts! (is-eq (ok true) (as-contract (stx-transfer? (get-amount id) tx-sender (unwrap-panic (get-owner id))))) ERR_NOT_VALID_AMOUNT)  
        (ok (map-set will-data { id: id } {claimed: true, unlock-time: (get-unlock-time id), amount: (get-amount id), donor: (get-donor id), url: (get-token-uri id)}))
    )
)