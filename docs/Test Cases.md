## Test cases

### Start, update cycle, skip

- Goal: for it to go to the next break/work cycle correctly
- Work time test:

```
!timer start
!timer cycle 4
!timer skip
```

- Break time test:

```
!timer start
!timer skip
!timer cycle 4
!timer skip
```
