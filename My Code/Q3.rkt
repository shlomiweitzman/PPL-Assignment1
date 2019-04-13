#lang racket
(provide (all-defined-out))

;; Signature: ngrams(list-of-symbols, n)
;; Purpose: Return a list of consecutive n symbols
;; Type: [List(Symbol) * Number -> List(List(Symbol))]
;; Precondition: n <= length(list-of-symbols)
;; Tests: (ngrams '(the cat in the hat) 3) => '((the cat in) (cat in the) (in the hat))
;;        (ngrams '(the cat in the hat) 2) => '((the cat) (cat in) (in the) (the hat))
(define ngrams
  (lambda (los n)
    (if (<= n (length los))
        (cons (first-n los n) (ngrams (cdr los) n))
        '())))

;; Signature: ngrams-with-padding(list-of-symbols, n)
;; Purpose: Return a list of consecutive n symbols, padding if necessary
;; Type: [List(Symbol) * Number -> List(List(Symbol))]
;; Precondition: n <= length(list-of-symbols)
;; Tests: (ngrams-with-padding '(the cat in the hat) 3) => '((the cat in) (cat in the) (in the hat) (the hat *) (hat * *))
;;        (ngrams-with-padding '(the cat in the hat) 2) => '((the cat) (cat in) (in the) (the hat) (hat *))
(define ngrams-with-padding
  (lambda (los n)
    (ngrams (asterisks los (- n 1)) n)))

;; Signature: first-n2(list-of-symbols, n, m)
;; Purpose: Return a list of the first n-m symbols in the list
;; Type: [List(Symbol) * Number * Number ->(List(Symbol))]
;; Precondition: n-m <= length(list-of-symbols)
;; Tests: (first-n2 '(the cat in the hat) 56 51) => '(the cat in the hat)
;;        (first-n2 '(the cat in the hat) 7 4) => '(the cat in)

(define first-n2
  (lambda (los n m)
    (if (>= m n)
        '()
          (cons (car los) (first-n2 (cdr los) n (+ m 1)))
          )))

;; Signature: first-n(list-of-symbols, n)
;; Purpose: Return a list of the first n symbols in the list
;; Type: [List(Symbol) * Number ->(List(Symbol))]
;; Precondition: 0 <= n <= length(list-of-symbols)
;; Tests: (first-n '(the cat in the hat) 5) => '(the cat in the hat)
;;        (first-n '(the cat in the hat) 3) => '(the cat in)
(define first-n
  (lambda (los n)
    (if (> n (length los))
        '()
        (first-n2 los n 0)
    )))

;; Signature: asterisk (list-of-symbols)
;; Purpose: Add a single asterisk to the end of the list
;; Type: [List(Symbol)->(List(Symbol))]
;; Precondition: (length los)>0 [the list shouldn't be empty]
;; Tests: (asterisk '(the cat in the hat)) => '(the cat in the hat *)
;;        (asterisk '(a)) => '(a *)
(define asterisk
  (lambda (los)
    (if (< (length los) 2)
        (cons (car los) '(*) )
        (cons (car los) (asterisk (cdr los))))
    ))

;; Signature: asterisks (list-of-symbols, n)
;; Purpose: Add n asterisks to the end of the list
;; Type: [List(Symbol) * Number->(List(Symbol))]
;; Precondition: n>=0 , (length los)>0 [the list shouldn't be empty]
;; Tests: (asterisks '(the cat in the hat) 3) => '(the cat in the hat * * *)
;;        (asterisks '(the cat in the hat) 0) => '(the cat in the hat)
(define asterisks
  (lambda (los n)
    (if (> n 0)
        (asterisks (asterisk los) (- n 1))
        los
        )))