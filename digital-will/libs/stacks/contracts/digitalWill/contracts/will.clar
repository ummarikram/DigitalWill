;; Digital Will NFT Smart Contract

;; Interface/Trait Enforcement
(impl-trait .sip009-nft-trait.sip009-nft-trait)

;; tokens
(define-non-fungible-token digital-will uint)

;; data maps and vars

(define-map will-data { id: uint } {claimed: bool, url: (optional (string-ascii 256))})
(define-constant ERR_NOT_OWNER (err u999))
(define-data-var current-id uint u0)

;; read-only functions

(define-read-only (get-last-token-id)
    (ok (var-get current-id))
)

(define-read-only (get-owner (id uint))
    (ok (nft-get-owner? digital-will id))
)

(define-read-only (get-token-uri (id uint))
    (ok (get url (unwrap-panic (map-get? will-data { id: id }))))
)

(define-read-only (is-claimed (id uint))
    (ok (get claimed (map-get? will-data { id: id })))
)

;; public functions

(define-public (transfer (id uint) (sender principal) (reciever principal))
    (begin
        (asserts! (is-eq tx-sender sender) ERR_NOT_OWNER)
        (nft-transfer? digital-will id sender reciever)
    )
)

(define-public (mint (beneficiary principal) (url (optional (string-ascii 256))))

    (let
        (
            (token-id (+ (var-get current-id) u1))
        )
        
        (try! (nft-mint? digital-will token-id beneficiary))

        (map-insert will-data { id: token-id } {claimed: false, url: url})

        (var-set current-id token-id)

        (ok "Success")
    )
)

(define-public (burn (id uint))
    (nft-burn? digital-will id tx-sender)
)
